<template>
	<v-container fluid>
		<v-layout wrap row align-center justify-center>
			<v-flex v-for='moduleData in recommendedModules' :key='moduleData.courseId' lg4 md4 sm6 xs12>
        <module-card v-if="moduleData"
          :item="moduleData"
          class="card-item"
          @click='goToModuleDetails(moduleData)' />
			</v-flex>
		</v-layout>
	</v-container>
</template>

<script>
import ModuleCard from './ModuleCard.vue'

export default {
  name: 'lms-recommended-modules',
  components: {
    ModuleCard
  },
  props: ['recommendedModules'],
  data: () => ({
    favIconColor: 'grey',
  }),
  methods: {
    goToModuleDetails(moduleData) {
      this.$router.push({name: 'LMSMODULEDETAILS',
        params: {
          moduleGuid: moduleData.moduleGuid,
        }
      })
    },
    changeFavoriteState: function(moduleData) {
      moduleData.isFavorite = !moduleData.isFavorite
    }
  }
}
</script>

<style scoped>
.card-item:hover {
  cursor: pointer;
}
</style>
