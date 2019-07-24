<template>
	<v-container fluid px-0 my-4>
		<!--COURSE HEADER-->
		<v-layout  my-2>
			ModuleHeader
		</v-layout>

		<!--MODULES CONT-->
		<v-layout align-center justify-center>
			<!--<v-flex xs9 style='border-right: darkgrey 1px solid'>!-->
			<v-flex lg8 md10 sm10 xs12>
				Lessons
			</v-flex>

			<!--RIGHT PANEL-->
			<v-flex xs3 class='py-5 px-4'>
				<h3>Про этот курс</h3>
				<p>QQ</p>
			</v-flex>
		</v-layout>
	</v-container>
</template>

<script>
var moduleGuid = "";
var moduleData = { data: undefined };

export default {
  name: "module-details",
  props: ["moduledetails"]
}
</script>

<style scoped>

</style>
