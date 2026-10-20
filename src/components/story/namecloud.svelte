<script>
	import copy from "$data/story.json";
	import data from "$data/name_counts_by_industry.csv"
	import {
		scaleLinear,
		scaleLog,
	} from "d3";

	// import { isMobile, initMobileWatcher } from "$utils/isMobile.js";
	let titleText = copy?.intro[0]
	let numGraphs = Object.keys(titleText).length-1;
	
	/*** DIMENSIONS ***/
	let svgHeight = $state(0)
	let containerWidth = $state(0);
	let containerHeight = $state(0);
	let margin = { top: 20, right: 24, bottom: 30, left: 24 };
	let width = $derived(containerWidth - margin.left - margin.right);
	let height = $derived(containerHeight - margin.top - margin.bottom);
	let sortedNames = $state([...data].sort((a, b) => b.total - a.total));
	
	// Set up log scale for font sizes
	const maxes = Object.keys(data[0]).reduce((acc, key) => {
		acc[key] = Math.max(...data.map(d => d[key]))
		return acc
	}, {})

	const mins = Object.keys(data[0]).reduce((acc, key) => {
		acc[key] = Math.min(...data.map(d => d[key]))
		return acc
	}, {})

	const fontSizeScale = $derived(scaleLog() // Remember: log scale cannot take val 0
		.domain([Math.max(mins[currentCategory],1),maxes[currentCategory]])
		.range([10, 26]));	

	const categoryLabels = ["All categories"]
	let currentCategory = $state("total")
	let currentLabel = $state(categoryLabels[0])

	$inspect(currentCategory)

	const colors = [

	["rgba(102, 166, 246, 1)","white"],
	["black","#black"],
];
6
</script>
<svelte:window onkeydown={handleKeydown} />

<div class="names-container">
    {#each sortedNames.filter(name => name.name != "average" && name.total > 100) as name (name.name)}
        {@const colorPair = colors[Math.floor(Math.random() * colors.length)]}
        <div
            class="entry-container"
            style:background-color={colorPair[0]}
            style:border={`1px solid ${colorPair[1]}`}
        >
			<div class="entry">
				<div
					class="name"
					style:font-size={`${fontSizeScale(Math.max(name[currentCategory],1))}px`}
				>
					{name.name}
				</div>
			</div>
		</div>
	{/each}
</div>

<style>
	.names-container {
		background-color: rgb(255, 255, 255);
		/* background-color: aquamarine; */
		position: relative;
		height: 95vh;
		/* margin: auto; */
		overflow-y: hidden;
		width: 100vw;
		align-items: center;
		display: flex;
		flex-direction: row;
		padding-left: 8%;
		padding-right: 8%;
		margin-bottom: 1%;
		/* row-gap: 2vh; */
		/* font-size: x-large; */
		flex-wrap: wrap; 
		justify-content: space-between;
	}
	.entry-container {
		max-width: 30vw;
		font-family: var(--font-sans);
		text-transform: uppercase;
		font-style: italic;
		text-align: center;
		margin-left: 0.3em;
		margin-right: 0.3em;
		margin-bottom: .6em;
		border-radius: 5%;
		padding: .25em .6em .25em .3em;
		opacity: 80%;

	}

	.entry {
		font-weight: 500;
		display: flex;
		opacity: 100% !important; 
		flex-direction: row;
		align-items: baseline;
		justify-content: center;
		text-align: center;
		gap: .01em;
		color: white;
	}

	.entry .count {
		opacity: .6;
		font-weight: 100;
	}

	p {
		font-size: medium;
		font-family: var(--font-sans);
	}
	:global(text) {
		/* font-family: "Atlas Grotesk"; */
		font-family: var(--font-sans);
		font-size: large;
		font-weight: 600;
	}

	


</style>
