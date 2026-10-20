<script>
	import copy from "$data/story.json";
	import data from "$data/gender.csv"
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
	let text = copy?.intro

	let numGraphs = text.length-1;
	/*** DIMENSIONS ***/
	let svgHeight = $state(0)
	let containerWidth = $state(0);
	let containerHeight = $state(0);
	let margin = { top: 20, right: 24, bottom: 30, left: 24 };
	let width = $derived(containerWidth - margin.left - margin.right);
	let height = $derived(containerHeight - margin.top - margin.bottom);


</script>

<div class="outer-container">
	<h1 class="title">Who's in a name? [tk]</h1>
	<div class="text-container">
		{#each text as content, i}
			{#if i > 0}
				<p>{content}</p>
			{/if}
		{/each}
	</div>
	<div class="transparent-placeholder"></div>
</div>

<style>

	.outer-container {
		background-color: #ffffff;
		position: relative;
		width: 100%;
		align-items: center;
		display: flex;
		flex-direction: column;
		padding: 8%;
		padding-bottom: 2%;
	}

	.text-container {
		width: 40vw;
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
	h1 {
		margin-top: 0px;
		font-size: 64px;
		font-weight: 600;
		margin-bottom: 70px;
		/* color: rgb(244, 130, 0); */
		font-family: var(--font-sans);
	}
	


</style>
