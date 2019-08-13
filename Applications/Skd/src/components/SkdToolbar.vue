<template>
	<v-layout row class='toolbar-container'>
		<v-flex lg4 class="text-container"> 
			<v-toolbar-title class='hidden-md-and-down'>Посетители</v-toolbar-title>
			<div class="btn-sort-container">
				<v-btn color="white" flat icon slot="activator" v-on:click="changeSort" class="btn-sort">
					<v-icon v-if="(sort == 1)" >av_timer</v-icon>
					<v-icon v-if="(sort == 0)">sort_by_alpha</v-icon>
				</v-btn>
			</div>
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
        return this.$store.state.skd.filter.value
      },
      set (value) {
        this.$store.dispatch('skd/setFilter', value)
      }
    },
    sort () {
      return this.$store.state.skd.sort
    },
  },
  methods: {
    changeSort () {
      this.$store.commit('skd/changeSort')
      this.$store.commit('skd/resetItemsOffset')
    },
  }
}
</script>
<style scoped>
.text-container{
	display: flex;
	align-items: center;
}
.btn-sort:hover::after{
	content: "Изменить сортировку";
	background-color: rgba(0, 0, 0, 0.55) !important;
    position: absolute;
    bottom: -20px;
    font-size: 10px;
    width: max-content;
    color: #f9f9f9;
    padding: 5px;
    border-radius: 5px;
}
.btn-sort-container{
	position: relative;
}
</style>
