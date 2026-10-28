import { GoogleGenAI } from "@google/genai";
import { csvParse, csvFormat } from "d3";
import * as fs from "fs";

const ai = new GoogleGenAI({});

// Input and output file paths
const INPUT_CSV = "./src/data/for-categorization.csv";
const OUTPUT_CSV = "./src/data/categorized.csv";

// How many store names to send per request
const BATCH_SIZE = 200;

// Schema to guarantee exact enum values
const responseSchema = {
  type: "array",
  description: "List of stores classified by chain footprint.",
  items: {
    type: "object",
    properties: {
      name: {
        type: "string",
        description: "Store name exactly as given in the input list.",
      },
      chain_type: {
        type: "string",
        description:
          "Footprint type: 'national', 'regional', 'local', or 'none' if not a chain.",
        enum: ["national", "regional", "local", "none"],
      },
    },
    required: ["name", "chain_type"],
  },
};

const PROMPT = `
Classify each store name below by its footprint in the United States:
- "national": Operates across multiple regions/coast-to-coast in the US.
- "regional": Operates across a specific geographic region (e.g., Midwest, Southeast, New England).
- "local": Operates in a limited presence in one metro/local area.
- "none": If it is not any type of chain (e.g., generic names, independent single mom-and-pop shops).

Return one entry for every store name, with the name copied exactly as given.

Store names:
`;

async function classifyBatch(names) {
  const response = await ai.models.generateContent({
    model: "gemini-3.8-flash",
    contents: PROMPT + names.join("\n"),
    config: {
      responseMimeType: "application/json",
      responseSchema,
    },
  });
  return JSON.parse(response.text);
}

async function run() {
  if (!fs.existsSync(INPUT_CSV)) {
    console.error(`Input file not found at: ${INPUT_CSV}`);
    process.exit(1);
  }

  const rows = csvParse(fs.readFileSync(INPUT_CSV, "utf-8"));
  const uniqueNames = [...new Set(rows.map((d) => d.name))];
  console.log(`Loaded ${rows.length} rows (${uniqueNames.length} unique names).`);

  // name -> chain_type
  const lookup = new Map();

  const totalBatches = Math.ceil(uniqueNames.length / BATCH_SIZE);
  const startTime = Date.now();
  console.log(`Sending ${totalBatches} batches of up to ${BATCH_SIZE} names to Gemini.\n`);

  for (let i = 0; i < uniqueNames.length; i += BATCH_SIZE) {
    const batch = uniqueNames.slice(i, i + BATCH_SIZE);
    const batchNum = i / BATCH_SIZE + 1;
    console.log(
      `[Batch ${batchNum}/${totalBatches}] Classifying names ${i + 1}-${i + batch.length} of ${uniqueNames.length}...`
    );

    // Print a heartbeat while waiting on the API
    const batchStart = Date.now();
    const heartbeat = setInterval(() => {
      const secs = Math.round((Date.now() - batchStart) / 1000);
      console.log(`  ...still waiting on Gemini (${secs}s)`);
    }, 10000);

    let results;
    try {
      results = await classifyBatch(batch);
    } finally {
      clearInterval(heartbeat);
    }

    for (const r of results) lookup.set(r.name, r.chain_type);

    // Per-batch summary
    const counts = {};
    for (const r of results) counts[r.chain_type] = (counts[r.chain_type] || 0) + 1;
    const secs = ((Date.now() - batchStart) / 1000).toFixed(1);
    console.log(`  Got ${results.length}/${batch.length} results in ${secs}s:`, counts);
    console.log(
      `  Examples:`,
      results.slice(0, 3).map((r) => `${r.name} → ${r.chain_type}`).join(", ")
    );
    console.log(`  Progress: ${lookup.size}/${uniqueNames.length} names classified\n`);
  }

  const totalSecs = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`All batches done in ${totalSecs}s.`);

  const missing = uniqueNames.filter((n) => !lookup.has(n));
  if (missing.length) {
    console.warn(`${missing.length} names got no classification (left blank):`, missing);
  } else {
    console.log("Every name was classified.");
  }

  // Keep all original columns and add chain_type
  const output = rows.map((d) => ({ ...d, chain_type: lookup.get(d.name) ?? "" }));

  // Overall tally across all rows
  const totals = {};
  for (const d of output) totals[d.chain_type || "(blank)"] = (totals[d.chain_type || "(blank)"] || 0) + 1;
  console.log("Totals by chain_type (all rows):", totals);

  console.log(`Writing ${output.length} rows to ${OUTPUT_CSV}...`);
  fs.writeFileSync(OUTPUT_CSV, csvFormat(output), "utf-8");
  console.log(`Success! Classified data saved to ${OUTPUT_CSV}`);
}

run().catch(console.error);
