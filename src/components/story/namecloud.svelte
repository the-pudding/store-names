<script>
	import copy from "$data/story.json";
	import data from "$data/name_counts_by_industry.csv"
	import {
		scaleLinear,
		scaleLog,
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
	import { flip } from 'svelte/animate';
	import { onMount } from 'svelte';

	// import { isMobile, initMobileWatcher } from "$utils/isMobile.js";
	let titleText = copy?.nutScroll[0]
	let numGraphs = Object.keys(titleText).length-1;
	
	/*** DIMENSIONS ***/
	let svgHeight = $state(0)
	let containerWidth = $state(0);
	let containerHeight = $state(0);
	let margin = { top: 20, right: 24, bottom: 30, left: 24 };
	let width = $derived(containerWidth - margin.left - margin.right);
	let height = $derived(containerHeight - margin.top - margin.bottom);
	let sortedNames = $state([...data]);
	
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
		.range([8, 24]));	

	let currentStoreIndex = 0
	const categories = ["total", "child_care", "chinese_restaurant", "pizzeria", "mexican_restaurant", "pub",  "clothes_tailor", "nail_salon", "auto", "florist", "bakery"]
	const categoryImgs = ["6.png", "2.png", "4.png", "8.png","3.png", "7.png","6.png", "1.png", "2.png","2.png", "5.png"]
	const categoryLabels = ["All categories", "Childchare", "Chinese restaurants", "Pizzerias", "Mexican Restuarant", "Pubs", "Tailors and dry cleaners", "Auto mechanic", "Florist", "Bakery"]
	let currentCategory = $state("total")
	let currentImage = $state(categoryImgs[0])
	let currentLabel = $state(categoryLabels[0])

	function handleKeydown(e) {
		console.log('keydown: ',e)
		if (e.key === 'ArrowRight') {
			currentStoreIndex = Math.min(currentStoreIndex +1, categories.length-1)

		}
		if (e.key === 'ArrowLeft'){
			if (currentStoreIndex > 0) currentStoreIndex -=1 
			else currentStoreIndex = 0
		}
		currentCategory = categories[currentStoreIndex]
		currentImage = categoryImgs[currentStoreIndex]
		currentLabel = categoryLabels[currentStoreIndex]
		sortedNames = data.sort((a, b) => b[currentCategory]-a[currentCategory]);

	}
	$inspect(currentCategory)
	$inspect(currentStoreIndex)


</script>
<svelte:window onkeydown={handleKeydown} />
<div class="img-container">
	<img src={`src/data/store_illustrations/${currentImage}`} alt="another store"> 
	<div class="img-label">{currentLabel}</div>
</div>
<div class="names-container">
	{#each sortedNames.filter(name => name.name != "average" && name.total > 100) as name (name.name)}
		<div class="entry-container" animate:flip={{ duration: 800 }}>
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
	.img-container {
		align-items: center;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
	.img-label {
		font-family: var(--font-sans);
		font-weight: 600;
	}

	img {
		max-height: 20vh;
	}
	.names-container {
		background-color: rgb(255, 255, 255);
		position: relative;
		width: 100%;
		align-items: center;
		display: flex;
		flex-direction: row;
		padding-left: 8%;
		padding-right: 8%;
		padding-top: 4%;
		/* row-gap: 2vh; */
		/* font-size: x-large; */
		flex-wrap: wrap; 
		justify-content: space-between;
	}
	.entry-container {
		max-width: 26vw;
		font-family: var(--font-sans);
		text-transform: capitalize;
		/* text-transform: uppercase; */

		margin-left: 0.35em;
		margin-right: 0.35em;
		margin-bottom: .6em;
		border: 2px solid rgba(226, 235, 251, 0.8);
		padding: .25em;
		padding-left: .3em;
		padding-right: .3em;
		/* font-style: italic; */
	}

	.entry {
		font-weight: 500;
		display: flex;
		flex-direction: row;
		align-items: baseline;
		gap: .15em;

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
