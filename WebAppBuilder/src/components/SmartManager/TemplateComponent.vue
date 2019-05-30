<template>
	<div>
		<!-- <sm-tasks :tasks = tasks ></sm-tasks> -->
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
	methods:{
		// beforeRouteUpdate (to, from, next) {
		// 	// получение данных для дочернего компонента
		// 	for(var cur of  this.$children){
		// 		if(cur.beforeRouteUpdate){
		// 			cur.beforeRouteUpdate(to,from);
		// 		} 
		// 	}
		// }
	},
}
</script>
<style>

</style>
