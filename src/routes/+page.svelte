<script>
	import { setContext } from "svelte";
	import { browser } from "$app/environment";
	import Meta from "$components/Meta.svelte";
	import Title from "$components/story/title.svelte";
	import Gender from "$components/story/gender.svelte"
	import copy from "$data/copy.json";
	import version from "$utils/version.js";
	import Street from "../components/story/street-testing.svelte";
	import Game from "../components/story/guessing-game.svelte";
	// import GameReverse from "../components/story/guessing_game_reverse.svelte";
	let { data } = $props();

	version();

	const preloadFont = [
		"https://pudding.cool/assets/fonts/tiempos/TiemposTextWeb-Regular.woff2",
		"https://pudding.cool/assets/fonts/tiempos/TiemposTextWeb-Bold.woff2",
		"https://pudding.cool/assets/fonts/atlas/AtlasGrotesk-Regular-Web.woff2",
		"https://pudding.cool/assets/fonts/atlas/AtlasGrotesk-Bold-Web.woff2"
	];

	const { title, description, url, keywords } = copy;
	setContext("copy", copy);
	setContext("data", data);
	let passIntro= $state();
	function handleStatus(status) {
		passIntro = status
	}
</script>

<Meta {title} {description} {url} {preloadFont} {keywords} />
<Game sendIntroCompleteStatus={handleStatus}></Game>
{#if passIntro}
	<Title/>
	<Gender startStage={0} endStage={3} introScroll={true}/>
	<Street></Street>
{/if} 
<!-- <Minicontainer categories={["total","bakery", "pizzeria", "pub"]} hue = "red"></Minicontainer>  -->
<!-- <Minicontainer categories={["auto_retail_service", "locksmith", "home_improvement"]} hue = "blue"></Minicontainer> -->
