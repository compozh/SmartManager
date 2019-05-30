<template>
	<div>
		<slot ></slot>
	</div>
</template>

<script>
export default {
	name: "template-component",
	props:['prop'],
	computed:{
		tasks(){
			if(this.$store.getters.getAppData("SMTASKS")){
				return this.$store.getters.getAppData("SMTASKS").data.smtasks.tasks;
			}
			return {};
		}
	},
}
</script>
<style>

</style>
