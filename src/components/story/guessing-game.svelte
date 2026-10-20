<script>
	import "$styles/app.css";

	/*** SCROLLY ***/
	let value = $state(-1);

	/*** DIMENSIONS ***/
	let containerWidth = $state(0);
	let containerHeight = $state(0);
	let margin = { top: 20, right: 24, bottom: 30, left: 24 };
	let width = $derived(containerWidth - margin.left - margin.right);
	let height = $derived(containerHeight - margin.top - margin.bottom);
	let index = $state(0)

	let currentRound = $state(0);

	let { sendIntroCompleteStatus }  = $props();

	const roundCorrect = $state([0, 0, 0]) // 0 = unanswered, 1 = correct, -1 = incorrect


	const titleTextByRound = [
		'"Let\'s meet at Tony\'s!" your friend says.',
		'"I need to make a stop at run to Carolyn\'s!" your friend says.',
		'"We should visit Lupita\'s!" your friend says.'
	]
	const answerIndices = [0, 2, 1]
	const storesByRound = [
		["pizza", "sporting", "pet"],
		["tech","garden","flower-shop"],
		["coffee", "bakery","bookshop"]
	]
	function incrementRound() {
		if (currentRound<2) currentRound+=1
		if (currentRound==2) sendIntroCompleteStatus(true)
	}
</script>
<div class="street-container">
	<h3 class="title-text">{titleTextByRound[currentRound]}</h3>
	<div class="buildings-container">
		{#each storesByRound[currentRound] as store, i}
		<div class="building">
			<img src="src/data/storefronts_merged/{store}.png" alt="storefront" 
			onclick={() => {
				roundCorrect[currentRound]= (i==answerIndices[currentRound]) ? "correct" : "incorrect"
				incrementRound()
			}	
			} role="presentation">
		</div>
		{/each}
	</div>
	<div class = "sidewalk"></div>
	<div class = "fill-bottom"></div>
	<div class = "progress-panel">
		<p>{currentRound+1}/3 names </p>
		<div class="dots-container">
			{#each storesByRound[currentRound] as store, i}
				<div class="progress-dot" 
				class:current={i===currentRound}
				class:correct={roundCorrect[i]==="correct"}
				class:incorrect={roundCorrect[i]==="incorrect"}
				id=i></div>
				<!-- {console.log(roundCorrect[currentRound], currentRound, roundCorrect[currentRound]==="correct")} -->
			{/each}
		</div>
		<p 	onclick={() => {
			sendIntroCompleteStatus(true)
		}	
		} role="presentation">
		Skip Quiz</p>
	</div>
</div>
<style>

.title-text {
	font-family: var(--font-sans);
	position: absolute;
	top: 10%;
	width: 100%;
	text-align: center;
	font-weight: bold;
}
.street-container {
	height: 100svh;
	width: 100svw;
	position: relative;
	overflow: hidden;
}

.buildings-container {
	display: flex;
	flex-direction: row;
	width: 98%;
	height: 85%;
	margin: auto;
	/* background-color: rgb(242, 252, 255);  */
	background-color: #fcfaf9; 
	gap: 2%;
	z-index:0;
}
.building {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: end;
	z-index:10;
}
img {
	z-index:10 !important;
}

.sidewalk {
		z-index:2;
		top: 83%;
		height: 10%;
		opacity: 100%;
		width: 100%;
		position: absolute;
		border-top: 1px solid #cec3ba;
		border-bottom: 1px solid #cec3ba;
		z-index: 1;
		margin: auto;
		background: repeating-linear-gradient(
		-65deg,
		#fffaf6 0,
		#fffaf6 250px,
		#cec3ba 250px,
		#cec3ba 251px
	);
	}
	
.fill-bottom {
	background-color: #fffaf6;
	height: 85%;
	z-index:0;
}

.progress-dot {
	background-color: rgb(211, 211, 211);
	height: 10px;
	width: 10px;
}

.progress-dot.current {
	border: 1px solid black;
}

.progress-dot.correct {
	background-color: green !important;
}

.progress-dot.incorrect {
	background-color: darkred;
}

.progress-panel {
	font-family: var(--font-sans);
	position: absolute;
	top: 90%;
	height: 5%;
	left: 35%;
	width: 30%;
	margin: auto;
	display: flex;
	flex-direction: row;
	z-index:10;
	border: 1px solid black;
	align-items: center;
	justify-content: center;
	gap: 10%;
}
.dots-container {
	display: flex;
	flex-direction: row;
	gap: 10%;
	width: 30%;
}

</style>
