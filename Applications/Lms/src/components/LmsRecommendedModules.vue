<template>
	<v-container fluid>
		<v-layout wrap row align-center justify-center>
			<v-flex v-for='moduleData in recommendedModules' :key='moduleData.courseId' lg4 md4 sm6 xs12>

        <module-card v-if="moduleData" :links="links" :moduleData="moduleData" />

			</v-flex>
		</v-layout>

	</v-container>
</template>

<script>
import ModuleCard from './ModuleCard.vue'
import { getThisLink } from '../helpers/navihelp.js'

export default {
  name: 'lms-recommended-modules',
  components: {
    ModuleCard
  },
  props: ['recommendedModules'],
  data: () => ({
    favIconColor: 'grey',
    links: []
  }),
  created() {
    this.links.push(getThisLink('Главная', this.$route.path, false))
  },
  methods: {
    changeFavoriteState: function(moduleData) {
      moduleData.isFavorite = !moduleData.isFavorite

    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#favIcon {
  margin: 8px 0px 6px 8px;
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none;
}
.roleBtn {
  transform: translate(23px, 0px) scale(0.8);
}
.lvlBtn {
  transform: scale(0.8);
}
.roleBtn,
.lvlBtn {
  font-size: 13px;
  color: rgb(120, 120, 120) !important;
}
.v-card--hover {
  cursor: default !important;
}
.cardTitle,
.v-card__media {
  cursor: pointer;
}
</style>
