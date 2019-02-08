<template>
	<div class="photo-container">
		<i class="material-icons" v-if="'https://m.it.ua/ws/GetFile.ashx?file=&folder=content&nodownload=1'==photo">person</i>
		<img :src="photo" height="auto" v-else alt="Photo">
	</div>
</template>

<script>
	export default {
		props: ['photo']
	}
</script>

<style lang="scss" scoped>
	$size: 80px;
	.photo-container {
		margin:10px;
		border-radius: 50%;
		overflow: hidden;
		height: $size;
		width: $size;
		box-shadow: 0 0 17px -7px black;

		img {
			width: inherit;
		}

		.material-icons {
			font-size: $size;
			color: #ddd;
		}
	}
</style>
