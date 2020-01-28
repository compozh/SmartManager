<template>
	<v-container fluid>
		<v-layout wrap row align-center justify-center>
			<v-flex v-for='course in recommendedCourses' :key='course.courseId' lg4 md4 sm6 xs122>

        <course-card v-if="course" :links="links" :course="course" />

			</v-flex>
		</v-layout>

	</v-container>
</template>

<script>
import CourseCard from './CourseCard.vue'
import { getThisLink } from '../helpers/navihelp.js'

export default {
  name: 'lms-recommended-courses',
  components: {
    CourseCard
  },
  props: ['recommendedCourses'],
  data: () => ({
    favIconColor: 'grey',
    links: []
  }),
  created () {
    this.links.push( getThisLink('Главная', this.$route.path, false))
  },
  methods: {
    changeFavoriteState: function(course) {
      course.isFavorite = !course.isFavorite

    },
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
