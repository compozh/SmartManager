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

export default {
  name: 'lms-recommended-courses',
  components: {
    CourseCard
  },
  props: ['recommendedCourses'],
  data: () => ({
    favIconColor: 'grey',
  }),
  methods: {
    goToCourseDetails(course) {
      this.$router.push({name: 'LMSCOURSEDETAILS',
        params: {
          courseGuid: course.courseGuid,
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
