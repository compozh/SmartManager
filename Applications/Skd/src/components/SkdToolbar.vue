<template>
	<v-layout row class='toolbar-container'>
		<v-flex lg4 class="text-container"> 
			<v-toolbar-title class='hidden-md-and-down'>Посетители</v-toolbar-title>
		</v-flex>
		<v-flex>
			<v-text-field 
			clearable
			flat
			hide-details
			label='Поиск'
			solo-inverted
			v-model='filter'
			>
			</v-text-field>
		</v-flex>
	</v-layout>
</template>
<script>
export default {
  name: 'skd-toolbar',
  computed: {
    filter: {
      get () {
        console.log(1)
        return this.$store.state.skd.filter.value
      },
      set (value) {
        console.log('set')
        // let filter = {name: 'search', value}
        this.$store.dispatch('skd/setFilter', value)
      }
    }
  },
}
</script>
<style scoped>
.text-container{
	display: flex;
	align-items: center;

}
</style>
