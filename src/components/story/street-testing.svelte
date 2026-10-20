<script>
	import Scrolly from "$components/helpers/Scrolly.svelte";
	import Mini from '$components/story/mini-draft.svelte'
	import story from "$data/story.json";
	let value = $state();
	
	let cumulativeDistance = $derived(
		script.slice(0, Math.min(value+1, script.length)).reduce((sum, d) => sum + d.increment, 0)
	);
	const copy = story["street"]
	const script = [
		{
			"highlight": ["child_care"],
			"metric": "counts",
			"increment": 1,
		},
		{
			"highlight": ["tattoo"],
			"metric": "counts",
			"increment": 1,
		},
		{
			"highlight": ["chinese_restaurant"],
			"metric": "counts",
			"increment": 1,
		},
		{
			"highlight": ["mexican_restaurant"],
			"metric": "counts",
			"increment": 1,
		},
		{
			"highlight": ["pizzeria"],
			"metric": "counts",
			"increment": 1,
		},
		{
			"highlight": ["pub"],
			"metric": "counts",
			"increment": 1,
		},
		{
			"highlight": ["nail_salon", "hair_salon"],
			"metric": "counts",
			"increment":1,
		},
		{
			"highlight": ["auto_retail_service"],
			"metric": "counts",
			"increment": 2,
		},
		{
			"highlight": ["auto_retail_service"],
			"metric": "percents",
			"increment": 0,
		},
		{
			"highlight": ["florist"],
			"metric": "percents",
			"increment": 1,
		},
		{
			"highlight": ["hair_salon"],
			"metric": "percents",
			"increment": 1,
		},
		{
			"highlight": ["pet"],
			"metric": "percents",
			"increment": 1,
		},
		{
			"highlight": ["home_improvement"],
			"metric": "percents",
			"increment": 1,
		},
		{
			"highlight": ["home_improvement"],
			"metric": "percents",
			"increment": 0,
		},
		{
			"highlight": ["clothes_tailor"],
			"metric": "percents",
			"increment": 1,
		},
		{
			"highlight": ["nail_salon"],
			"metric": "percents",
			"increment": 1,
		},
		{
			"highlight": ["boutique"],
			"metric": "percents",
			"increment": 1,
		},
		{
			"highlight": ["car_delearship"],
			"metric": "percents",
			"increment": 1,
		},
		{
			"highlight": ["ice_cream_candy"],
			"metric": "percents",
			"increment": 1,
		},
		{
			"highlight": ["bakery"],
			"metric": "percents",
			"increment": 1,
		},
		{
			"highlight": ["liquor_smoke"],
			"metric": "percents",
			"increment": 1,
		},
	]

	const dataNamesToIllustrationNames = {
		"child_care": "daycare",
		"chinese_restaurant": "chinese",
		"mexican_restaurant": "mexican",
		"tattoo": "tattoo",
		"pizzeria": "pizza",
		"restaurant": "restaurant",
		"pub": "pub",
		"nail_salon": "nail",
		"hair_salon": "hair",
		"clothes_tailor": "tailor",
		"antique and vintage": "antiques",
		"butcher_deli": "pet",
		"pet": "pet",
		"theater": "theater",
		"butcher_deli": "mechanic",
		"auto_retail_service": "mechanic",
		"florist": "flower-shop",
		"liquor_smoke": "flower-shop",
		"locksmith": "flower-shop",
		"bakery":"bakery",
		"ice_cream_candy": "icecream",
		"home_improvement": "plumbing",
		"boutique": "clothing",
		"car_delearship": "car",
		"boutique": "clothing"
	}

	const storesInOrder = [
		"restaurant",
		"pub",
		"child_care",
		"tattoo",
		"chinese_restaurant",
		"mexican_restaurant",
		"pizzeria",
		"pub",
		"hair_salon",
		"nail_salon",
		"auto_retail_service",
		"florist",
		"hair_salon",
		"pet",
		"home_improvement",
		"clothes_tailor",
		"nail_salon",
		"boutique",
		"car_delearship",
		"ice_cream_candy",
		"bakery",		
		"liquor_smoke",
	]

</script>

<div id="scrolly">
	<div class= "bg">
		<div class= "street" style={`transform: translateX(${-25* (cumulativeDistance>0?cumulativeDistance:1) +25}vw)`}>
			<div class = "sky"></div>
			<div id = "sidewalk"></div>
			{#each storesInOrder as store, i}
			<div class="store-slot" class:blur={!script[(value??0)]["highlight"].includes(store)}>
				<div class="building-container">
					<img class="building" id={store} src="src/data/storefronts_merged/{dataNamesToIllustrationNames[store]}.png" alt="storefront">
				</div>
				{#if (script[(value??0)]["highlight"].includes(store))}
					<Mini category={store} metric={script[(value??0)]["metric"]} />
				{/if}
			</div>
			{/each}
			<div class= "ground"></div>

		</div>
	</div>
	<div class="scrolly-outer">
		<Scrolly bind:value>
			{#each script as entry, i}
				{@const active = value === i}
				<div class="step" class:active>
					<p>{@html copy[i]}</p>
				</div>
			{/each}
		</Scrolly>
	</div>
	<div class="spacer"></div>
</div>

<style>
	#scrolly {
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}
	.bg {
		margin: 0;
		position: sticky;
		top: 0;
		height: 100vh;
		display: flex;
		align-items: flex-end;
		width: 100%;
		z-index: 0;
		overflow: hidden;  
		/* border: 1px solid brown */
	}


	.street {
		height: 100%;
		left: -15vw;
		position: absolute;
		padding-top: 3%;
		width: max-content;
		display: flex;
		transition: transform 400ms ease-in-out;
	}
	.sky {
		top: 0%;
		height: 46%;
		position: absolute;
		/* background-color: #1e1e1e; */
		background: rgb(242, 252, 255);
		/* background: rgb(177, 238, 255); */

		width: 100%;
	}

	.ground {
		top: 46%;
		height: 60%;
		position: absolute;
		/* background-color: #1e1e1e; */
		background: #fffaf6;
		width: 100%;
		z-index: 0;
	}

	.store-slot {
		width: 25vw;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		gap: 1%;
		z-index:2;
		padding-bottom: 0%;
		transition: filter 400ms ease-in-out,opacity 400ms ease-in-out;
	}

	#sidewalk {
		top: 45%;
		height: 5%;
		opacity: 100%;
		width: 100%;
		position: absolute;
		border-top: 1px solid #160b03;
		border-bottom: 1px solid #160b03;
		z-index: 1;
		margin: auto;

		background: repeating-linear-gradient(
		-65deg,
		#fffaf6 0,
		#fffaf6 250px,
		#160b03 250px,
		#160b03 251px
	);
	}
	.building-container {
		position: relative;
		height: 46%;
		flex: 0 0 46%;
		width: auto;
	}

	.building {
		width: auto;
		height: 100%;
		display: block;
	}

	.store-slot.blur .building-container::after {
		content: "";
		position: absolute;
		inset: 0;
		background: rgba(255, 255, 255,.6);
		pointer-events: none;
		filter: blur(4px)
	}

	.spacer {
		height: 75vh;
	}

	.scrolly-outer {
		z-index: 2;
		display: flex;
		flex-direction: row;
		width: 100%;
		position: relative;
	}

	.step {
		height: 75vh;
		max-width: 35vw;
		margin: 0;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		z-index: 10;
		/* background-color: white; */
		opacity: 100%;
	}

	.step p {
		
		opacity: 100%;
		padding: 2rem;
		margin: 0;
		color: black;
		white-space: pre-line;
		background: white;
		border: 2px solid black;
		border-radius: 1%;
		width: 70%;
		font-size: large;
		text-align: left;

	}
</style>
