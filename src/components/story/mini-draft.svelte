<script>
	import counts from "$data/name_counts_by_industry.csv"
	import percents from "$data/_name_distributions.csv"
	import {
		scaleLinear,
	} from "d3";
	import { flip } from 'svelte/animate';
	
	let { category, metric } = $props()

	let data = $derived(metric=="percents" ? percents : counts);

	let sortedNames = $derived(data.sort((a, b) => b[category]-a[category]).slice(0,10));
	
	function formatPct(num) {
		return (num * 100).toFixed(1) + "%"
	}
	/*** DIMENSIONS ***/
	let svgHeight = $state(0)
	let containerWidth = $state(0);
	let containerHeight = $state(0);
	let margin = { top: 20, right: 24, bottom: 30, left: 24 };
	let width = $derived(containerWidth - margin.left - margin.right);
	let height = $derived(containerHeight - margin.top - margin.bottom);

	const maxWidth = $derived(data.reduce(
		(max, d) => Math.max(max, parseFloat(d[category])),0))    
		
    let xScale = $derived(scaleLinear()
      .domain([0, maxWidth])    
      .range([0, width]));

    let yScale = $derived(scaleLinear()
      .domain([0, data.length])    
      .range([0, height]));

	const colors = {
		"counts": {"top": "#98caff", "list": "#7fbbfb59"},
		"percents": {"top": "#ffc459", "list": "#ffdfa6"}

	}
</script>
<svelte:window onkeydown={handleKeydown} />
	<div class="names-container">
		{#each sortedNames as name,i (name.name)}
			<div class="entry-container" animate:flip={{ duration: 300 }}>
				<div class="bar-container" bind:clientWidth={width} bind:clientHeight={height}>
					<div class="name" 
					class:top={i === 0} 
					style:width={`${xScale(name[category])}px`} 
					style:background-color={colors[metric ?? "counts"][(name[category] == maxWidth) ? "top" : "list"]}> {name.name}</div>
				</div>
				{#if (i==0)}
				<div class="count">{metric=="percents" ? formatPct(Number(name[category])) : Number(name[category]).toLocaleString()}</div>
				{/if}
			</div>
		{/each}
	</div>

<style>

	.names-container {
		position: relative;
		width: 100%;
		flex-grow: 1; 
		align-items: center;
		display: flex;
		padding-top:3%;
		padding-bottom: 3%;
		gap: 1%;
		flex-direction: column;
		white-space: nowrap;
		overflow: visible;
	}
	.entry-container {
		/* border: 1px solid green; */
		width: 50%;
		flex-direction: row;
		gap: 5%;
		display: flex;
		font-family: var(--font-sans);
		color: black;
		/* font-weight: bold; */
		text-transform: uppercase;
		font-size: 18px;
		font-style: italic;
		margin-left: 0.35em;
		margin-right: 0.35em;
		/* margin-bottom: 0.35em; */
		padding-left: .3em;
		padding-right: .3em;
		height: 100%;
	}

	.bar-container {
		flex: 0 0 100%;
		height: 90%;
		display: flex;
		flex-direction: column;
		border: 1px solid rgb(45, 21, 12);
		background: white;
	}

	.name {
		height: 100%;
		display: flex;            
		align-items: center;       
		padding-left: 2%;
		font-size: 21px;
		/* background-color: #7fbbfb59; */
	}

	.count {
		height: 90%;
		font-size: 18px;
		color: black;
		display: flex;
		align-items: center;
		justify-content: center;
		font-style: normal;
		/* border: 1px solid black; */
	}

	:global(text) {
		/* font-family: "Atlas Grotesk"; */
		font-family: var(--font-sans);
		font-size: 40px;
		font-weight: 600;
	}

</style>
