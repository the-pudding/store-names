<script>
	import Scrolly from "$components/helpers/Scrolly.svelte";
	import Minitake2 from '$components/story/minitake2.svelte'

	let value = $state();
	
	let cumulativeDistance = $derived(
		script.slice(0, Math.min(value+1, script.length)).reduce((sum, d) => sum + d.increment, 0)
	);

	const script = [
		{
			"highlight": ["child_care"],
			"metric": "counts",
			"text": "Noah is by far the most popular name on daycares, commonly referencing Noah's Ark.",
			"increment": 1,
		},
		{
			"highlight": ["tattoo"],
			"metric": "counts",
			"text": "For a tattoo, chances are you're headed to <i>Charlie's</i>, <i>Lou's</i>, or—if you're Lucky—Lucky's.",
			"increment": 1,
		},
		{
			"highlight": ["chinese_restaurant"],
			"metric": "counts",
			"text": "We can see the names used most frequently for cultural cuisines, like Chinese restaurants, ",
			"increment": 1,
		},
		{
			"highlight": ["mexican_restaurant"],
			"metric": "counts",
			"text": "Mexican restaurants,",
			"increment": 1,
		},
		{
			"highlight": ["pizzeria"],
			"metric": "counts",
			"text": "pizzerias,",
			"increment": 1,
		},
		{
			"highlight": ["pub"],
			"metric": "counts",
			"text": "and pubs.",
			"increment": 1,
		},
		{
			"highlight": ["nail_salon", "hair_salon"],
			"metric": "counts",
			"text": "Kim is the most common name on hair and nail salons.\n\n<i>Kim</i> could be a first or last name. The frequencies of <i>Lee</i> and <i>Le</i> suggest that <i>Kim</i> is more likely a last name on nail salons than hair salons.",		
			"increment":1,
		},
		{
			"highlight": ["auto_retail_service"],
			"metric": "counts",
			"text": "The top auto mechanic names are all among the most common names overall.",
			"increment": 2,
		},
		{
			"highlight": ["auto_retail_service"],
			"metric": "percents",
			"text": "But smaller names often have stronger ties to a business category.\n\nTo see this, let's look at the names with the highest <i>share </i>of auto shops.\n\nOf all Conrad's, 41.6 percent are mechanics. That's more than any other name.",
			"increment": 0,
		},
		{
			"highlight": ["florist"],
			"metric": "percents",
			"text": "These associations often relate thematically.\n\n For example, <i>Faye</i>, <i>April</i>, <i>Lilly</i>, and <i>Lily</i> are among the most overrepresented on florists.",
			"increment": 1,
		},
		{
			"highlight": ["hair_salon"],
			"metric": "percents",
			"text": "Likewise, <i>Diva</i> has the strongest association to hair salons.",		
			"increment": 1,
		},
		{
			"highlight": ["pet"],
			"metric": "percents",
			"text": "<i>Noah</i> and <i>Kitty</i> are among the most overrepresented on pet shops.\n\n Notably, eight other names are even more strongly associated with pet shops than <i>Kitty</i>.",
			"increment": 1,
		},
		{
			"highlight": ["home_improvement"],
			"metric": "percents",
			"text": "On home improvement services—plumbing, landscaping, construction, and on—several of the most overrepresented names are last names, seeming to project professionalism over warmth.",		
			"increment": 1,
		},
		{
			"highlight": ["home_improvement"],
			"metric": "percents",
			"text": "On the other hand, <i>Troy</i> conjures a fairly vivid image of the man coming to fix your flooring.",		
			"increment": 0,
		},
		{
			"highlight": ["clothes_tailor"],
			"metric": "percents",
			"text": "Sometimes, one name stands apart. \n\n <i>Sun</i> appears on laundry services at twice the frequency of <i>Han</i>, the second-most overrepresented name.",		
			"increment": 1,
		},
		{
			"highlight": ["nail_salon"],
			"metric": "percents",
			"text": "Before, we saw <i>Le</i> was the fourth-most common name on nail salons. \n\n A quarter of <i>Le's</i>  are nail salons—that's a far greater share than any other name.",		
			"increment": 1,
		},
		{
			"highlight": ["boutique"],
			"metric": "percents",
			"text": "...",		
			"increment": 1,
		},
		{
			"highlight": ["car_delearship"],
			"metric": "percents",
			"text": "...",		
			"increment": 1,
		},
		{
			"highlight": ["ice_cream_candy"],
			"metric": "percents",
			"text": "...",		
			"increment": 1,
		},
		{
			"highlight": ["liquor_smoke"],
			"metric": "percents",
			"text": "liquor store.",
			"increment": 1,
		},
		{
			"highlight": ["bar"],
			"metric": "percents",
			"text": "ly, Carolyn and Marilyn.",
			"increment": 1,
		}
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
		"bar":"bakery",
		"ice_cream_candy": "icecream",
		"home_improvement": "plumbing",
		"boutique": "clothing",
		"car_delearship": "car"
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
		"bar",		
		"liquor_smoke",
	]

</script>

<div id="scrolly">
	<div class= "bg">
		<div class= "street" style={`transform: translateX(${-25* (cumulativeDistance>0?cumulativeDistance:1) +25}vw)`}>
			<!-- <div class="building-placeholder"></div> -->
			<div class = "sky"></div>
			<div id = "sidewalk"></div>
			{#each storesInOrder as store, i}
			<!-- {console.log(script, (value??0), script[0])} -->
			<div class="store-slot" class:blur={!script[(value??0)]["highlight"].includes(store)}>
				<div class="building-container">
					<img class="building" id={store} src="src/data/storefronts_merged/{dataNamesToIllustrationNames[store]}.png" alt="storefront">
				</div>
				{#if (script[(value??0)]["highlight"].includes(store))}
					<Minitake2 category={store} metric={script[(value??0)]["metric"]} />
				{/if}
			</div>
			{/each}
			<div class= "dirt"></div>

		</div>
	</div>
	<!-- <div class="spacer"></div> -->
	<div class="scrolly-outer">
		<Scrolly bind:value>
			{#each script as entry, i}
				{@const active = value === i}
				<div class="step" class:active>
					<p>{@html entry.text}</p>
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
		/* margin-top: auto; */
		height: 100%;
		left: -15vw;
		position: absolute;
		padding-top: 3%;
		/* top: 5%; */
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

	.dirt {
		top: 46%;
		height: 60%;
		position: absolute;
		/* background-color: #1e1e1e; */
		background: #fffaf6;
		width: 100%;
		z-index: 0;
	}

 	/* .store-slot.blur .building {
		filter: brightness(40%); 
	}  */

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
