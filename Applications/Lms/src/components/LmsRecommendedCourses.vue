<template>
  <v-container fluid>
    <v-layout wrap row align-center justify-center>
      <v-flex v-for='course in recommendedCourses' :key='course.courseId' lg4 md4 sm6 xs12>
        <course-card v-if="course"
          :item="course"
          class="card-item"
          @click='goToCourseDetails(course)' />
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
    goToCourseDetails(course) {
      this.$router.push({name: 'LMSCOURSEDETAILS',
        params: {
          courseGuid: course.courseGuid,
          links: this.links
        }
      })
    },
    changeFavoriteState: function(course) {
      course.isFavorite = !course.isFavorite
    },
  }
}
</script>

<style scoped>

.card-item:hover {
  cursor: pointer;
}
</style>
