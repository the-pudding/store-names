<script>
	import Scrolly from "$components/helpers/Scrolly.svelte";
	import copy from "$data/story.json";
	import data from "$data/industry_by_gender.csv"
	import {
		scaleLinear,
		range,
		min,
		max,
		groups,
		forceSimulation,
		forceX,
		forceY,
		forceCollide,
		selectAll,
		axisBottom,
		easeCubicInOut
	} from "d3";
	// import { isMobile, initMobileWatcher } from "$utils/isMobile.js";

	/*** SCROLLY ***/
	let value = $state(-1);
	let filteredStages = $derived(
		copy.genderScroll
			? copy.genderScroll : []
	);
	let currentStage = $derived(filteredStages?.[value]);
	let currentId = $derived(isNaN(value) || value == -1 ? 0 : +currentStage?.id);
	let signpost = $state(1)
	let hasStarted =$state(false);
	// $inspect(currentId)
	// $inspect(signpost)
	$effect(()=>{
		if (currentId ==1) signpost = 1
		if (currentId == 5) signpost = 5
	})

	/*** DIMENSIONS ***/
	let containerWidth = $state(0);
	let containerHeight = $state(0);
	let margin = { top: 20, right: 24, bottom: 30, left: 24 };
	let width = $derived(containerWidth - margin.left - margin.right);
	let height = $derived(containerHeight - margin.top - margin.bottom);
	
	/*** SCALES ***/
	const xScale = $derived(
	scaleLinear()
		.domain([0, 100])
		.range([margin.left, width - margin.right - margin.left])
	);

	const cols = 6
	const cellWidth = $derived(containerWidth * .75/ cols)
	const cellHeight = $derived(containerHeight *.75 / 5)

	const gridX = function(i) {
		return (i % cols) * cellWidth + (containerWidth /2 - cellWidth*3) + cellWidth/3
	}
	const gridY = function(i) {
		return (containerHeight - containerHeight * .75) / 2 + Math.floor(i / cols) * cellHeight 
	}

	let storePositions = $derived.by(() => {
		const dataPoints = data.map((d,i) =>{
			return {
				category: d.industry,
				grid_x: gridX(i),
				grid_y: gridY(i),
				pct_female: d.pct_female,
				x: parseFloat(d.pct_female),
				y: containerHeight *.425,
				fx: xScale(parseFloat(d.pct_female)), /* freeze x pos before simulation */
				size: d.total_names 
			}
		})
		let storeHeight = 50;
		let xStrength = .2;
		let yStrength = 1.5;
		let collideRadius = storeHeight;

		const sim = forceSimulation(dataPoints)
				.force("x", forceX((d) => d.x).strength(xStrength))
				.force("y", forceY((d) => d.y).strength(yStrength))
				.force("collide", forceCollide(collideRadius).iterations(3))
				.alphaDecay(0.02)
				.stop();

		for (let i = 0; i < 300; ++i) sim.tick();
		return dataPoints
	})

	$effect(() => {
		// Sets up axis
		if (containerWidth > 0) {
			selectAll("#beeswarm .x-axisog").call(
				axisBottom(xScale)
			.tickValues([0, 25,50,75,100])
			// .tickSizeInner(-height)
			.tickFormat((d) => `${d}/${100-d}`))
			.selectAll("text").attr("dy", "1em")
			selectAll("#beeswarm x-grid").call(axisBottom(xScale))
		}
		})
	
	const inactiveIds = [1]
	const stepPositions = [
		"center", "center", "right", "left", "right", "right", "right", "", ""
	]

	const highlight_key = 
		[
		[],
		[],
		["auto_retail_service"], 
		["nail_salon", "child_care", "boutique"],
		["hair_salon", "barber"], 
		["garden_center", "florist"], 
		["coffee","bakery","butcher_deli", "pizzeria" ], 
		[]]

	const dataNamesToIllustrationNames = {
		"bowling and arcade": 'pizza',
		"child_care": "daycare",
		"chinese_restaurant": "chinese",
		"mexican_restaurant": "mexican",
		"tattoo": "tattoo",
		"pizzeria": "pizza",
		"restaurant": "restaurant",
		"pub": "pub",
		"nail_salon": "nail",
		"boutique": "clothing",
		"restaurant": "restaurant",
		"locksmith": "hardware",
		"pet": "pet",
		"diner": "diner",
		"jewelry": "flower-shop",
		"hair_salon": "hair",
		"sports_bar": "pub",
		"sandwich": "diner",
		"clothes_tailor": "tailor",
		"antique and vintage": "antiques",
		"sporting_goods":"sporting",
		"home_improvement":"plumbing",
		"butcher_deli": "diner",
		"theater": "theater",
		"auto_retail_service": "mechanic",
		"clothing": "clothing",
		"florist": "flower-shop",
		"music": "music",
		"grocery": "grocery",
		"liquor_smoke": "grocery",
		"tech": "tech",
		"furniture_and_home": "furniture",
		"drugstore":"drugstore",
		"ice_cream_candy": "icecream",
		"books": "bookshop",
		"bar":"bar",
		"furniture_home": "furniture",
		"garden_center": "garden",
		"coffee": "coffee",
		"barber": "barber-shop",
		"bakery": "bakery",
		"bike": "bike",
		"car_dealership": "car"
	}
	$inspect(storePositions)
</script>

<div class="outer-container">
	<!-- <h2>Scrolly <span>{value || "-"}</span></h2> -->
	<div class="sticky-container">
		<div id="beeswarm" class="chart-container"
			bind:clientHeight={containerHeight}
			bind:clientWidth={containerWidth}
			>	
				<svg {width} {height}>
					<g
						class="axis x-axisog"
						transform="translate({margin.left}, {height - margin.top - margin.bottom})"
						opacity={(currentId > 0 ||signpost ==5) ? 1 : 0}
					></g>
				</svg>
				<div class="axis_labels" style:opacity={(currentId > 0 ||signpost ==5) ? 1 : 0}>
					<div class="male" >More male</div>
					<div class="female" >More female</div>
				</div>
			<!-- {/if} -->
			<div class="storefronts-overlay" style="width: {width}px; height: {height}px;">
				<div class="pct-labels">
					{#each storePositions as point}
					<div class="label"
						class:highlighted={highlight_key[currentId]?.includes(point.category)}
						style="left: {point.x}px; top: -5px;">
						<p>{Number(point.pct_female).toFixed(1)}</p>
					</div>
					{/each}
				</div>
				<svg class="lines" width={width} height={height}>
					{#each storePositions as point}
					<line
					class="line"
					class:highlighted={highlight_key[currentId]?.includes(point.category)}
						x1={point.x}
						y1=42
						x2={point.x}
						y2={height- margin.top - margin.bottom*1.5}
						stroke-dasharray="10"
						stroke-width="2"
					/>
					{/each}
				</svg>
				{#each storePositions as point, i}
					<div class ="store"
						class:beeswarm={currentId > 0 || signpost ==5} 
						class:all={currentId == 0}
					    class:highlighted={highlight_key[currentId]?.includes(point.category)}
						
						class:off={highlight_key[currentId].length != 0 && !highlight_key[currentId]?.includes(point.category)}
						style="left: {(currentId===0 && signpost==1)? point.grid_x : point.x}px; top: {(currentId===0 && signpost==1 )?point.grid_y: point.y}px;">
						<img class="building" 			
						src="src/data/uniques_full/{dataNamesToIllustrationNames[point.category]?? "mechanic"}.png" alt="storefront">
						<!-- <img class="window" src="src/data/storefronts/clothing shop.jpg" alt="storefront"> -->
						{console.log(dataNamesToIllustrationNames[point.category], point.category)}
					</div>
				{/each}
			</div>
		</div>

	</div>

	<div class="scrolly-outer {stepPositions[currentId]}" >
		<Scrolly bind:value>
			{#each [0, 1, 2, 3, 4, 5,6] as num}
				{#if filteredStages[num]}
					<div
						class="step {stepPositions[num]}"
						class:active={num === currentId && !inactiveIds.includes(num)}
					>
						<p>{@html filteredStages[num].text}</p>
					</div>
				{/if}
			{/each}
		</Scrolly>
	</div>
</div>

<style>

	.pct-labels {
		width: 100%;
		height: 100%;
		position: absolute;
	}
	.label {
		transition: opacity 300ms ease;
		position: absolute;
		opacity: 0;
		transform: translateX(-50%);
		text-align: center;
	}

	.label.highlighted {
		opacity: 1;
	}

	.store {
		width: 140px;
		position: absolute;
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: 1fr;
		place-items: center;
		transform: translateX(-50%) translateY(-50%);
		z-index: 8;
		transition:
			left 600ms ease,
			top 600ms ease,
			filter 300ms ease,
			opacity 300ms ease,
			width 300ms ease;
	}	

	.store.beeswarm {
		width: 90px;
	}

	.store .building {
		grid-column: 1;
		grid-row: 1;
		width: 100%;
		height: auto;
		z-index: 2;
	}
	
	.line {
		opacity: 0;
		transition:
			opacity 300ms ease,
	}
	.line.highlighted {
		opacity: 1;
		stroke: rgb(154, 168, 180)	}

	.store .window {
		grid-column: 1;
		grid-row: 1;
		z-index: 1;
		width: 80%;
		padding-top: 25%;
	}

	.store.highlighted .window  {
		opacity: 1;
	}
	.store.all {
		opacity: .9;
	}
	.x-grid line {
		stroke: lightgray;
		stroke-width: 1;
	}
	.store.off {
		/* filter: grayscale(100%); */
		opacity: .035;
	}

	.store.highlighted {
		width: 200px;
		z-index: 10;
		opacity: 1;
	}

	.chart-container {
		width: 100%;
		padding: 1rem;
		height: 100%;
		margin: 0;
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		transition: opacity var(--1s) ease-in-out;
		pointer-events: none;
		background-color: rgb(255, 255, 255);
	}

	.storefronts-overlay {
		position: absolute;
		pointer-events: none;
		overflow: visible;
	}

	.outer-container {
		position: relative;
		width: 100%;
	}

	.sticky-container {
		background-color: white;
		width: 100%;
		height: 100svh;
		position: sticky !important;
		top: 0;
		z-index: 1;
	}

	.axis_labels {
		display: flex;
		flex-direction: row;
		font-weight: 800;
		font-family: "Atlas Grotesk";
	}
	.male {
		margin-right: 0;
		text-align: left;
		width: 100%;

	}

	.female {
		margin-right: 0;
		text-align: right;
		width: 100%;
	}

	:global(text) {
		font-family: "Atlas Grotesk";
		font-size: medium;
		font-weight: 600;
	}
	
	.transparent-placeholder {
		height: 100vh;
		position: relative;
		border: 1px solid red;
	}

	.scrolly-outer {
		display: flex;
		flex-direction: row;
		width: 100%;
		position: relative;
		z-index: 2;
	}

	.scrolly-outer.center {
		justify-content: center;
	}

	.scrolly-outer.right {
		justify-content: flex-end;
	}

	.scrolly-outer.left {
		justify-content: flex-start;
	}

	.step {
		height: auto;
		padding: 5%;
		display: flex;
		box-sizing: content-box;
		opacity: 0;
		margin-bottom: 100vh;
	}

	.step.active {
		opacity: 1;
		background: rgba(255, 255, 255, 0.939);
		align-items: center;
		border: 2px solid black;
	}

	.step.active.center {
		border-radius: .5em .5em .5em .5em;
		text-align: center;

	}

	.step.active.right {
		border-radius: .5em 0em 0em .5em;
		text-align: right;

	}

	.step.active.left {
		border-radius: 0em .5em .5em 0em;
		text-align: left;

	}
	.step p {
		color: rgb(25, 25, 25);
		max-width: 20vw;
		font-size: large;

	}


</style>
