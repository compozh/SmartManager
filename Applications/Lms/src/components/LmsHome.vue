<template>
	<v-container fluid mx-0 my-0 px-0 py-0>
		<v-parallax id='parallaxPadding' :src="image" >
			<v-jumbotron :gradient="gradient" dark height='500px'>
				<v-layout align-center justify-end column fill-height class="white--text text-xs-center">
					<h4 class='mb-4 display-2 font-weight-medium'>Добро пожаловать в университет</h4>
					<h5 class='mb-5 headline font-weight-medium'>Лучший способ улучшить свои навыки и изучить IT-Enterprise</h5>
					<v-btn class='mb-5' color='orange' dark large :to="{name: 'LMSCOURSES'}">Начать обучение</v-btn>
				</v-layout>
			</v-jumbotron>
		</v-parallax>
		<v-layout my-4 align-center justify-end column fill-height>
			<h4 class='pt-3 pb-1 headline font-weight-medium text-xs-center grey--text text--darken-3'>Ознакомьтесь с рекомендуемыми курсами</h4>
			<h5 class='mx-3 subheading font-weight-regular text-xs-center grey--text text--darken-3'>Курсы обучения - ориентированные учебные пути, которые комплексно повышают ваши навыки работы</h5>
			<v-layout mt-4 align-center justify-end column fill-height>
				<lms-recommended-courses v-if='recommended' :recommendedCourses='recommended.courses'>
				</lms-recommended-courses>
			</v-layout>
			<h4 class='pt-3 pb-1 headline font-weight-medium text-xs-center grey--text text--darken-3'>Ознакомьтесь с рекомендуемыми модулями</h4>
			<h5 class='mx-3 subheading font-weight-regular text-xs-center grey--text text--darken-3'>Модули - короткие самостоятельные учебные пособия, которые охватывают отдельные темы и задачи</h5>
			<v-layout mt-4 align-center justify-end column fill-height>
				<lms-recommended-modules v-if='recommended' :recommendedModules='recommended.modules'>
				</lms-recommended-modules>
			</v-layout>
		</v-layout>
	</v-container>
</template>

<script>

import image from '../assets/home.jpg'
import recommendedCourses from './LmsRecommendedCourses.vue'
import recommendedModules from './LmsRecommendedModules.vue'

export default {
  name: "lms-home",
  components: {
    recommendedCourses,
    recommendedModules
  },
  data: () => ({
    gradient: "to top, rgba(0,0,0,.8),rgba(0,0,0,.3), rgba(0,0,0,0)",
    image
  }),
  methods: {
    getAvailableFilters() {
      this.$store.dispatch('lms/getAvailableFilters')
    },

    getRecommended() {
      const recommended = this.$store.getters['lms/recommended']
      if(!recommended) {
        this.$store.dispatch('lms/getRecommended')
      }
    }
  },
  created () {
    this.getAvailableFilters()
    this.getRecommended()
  },
  computed: {
    recommended() {
      return this.$store.getters['lms/recommended']
    }
  }
}
</script>

<style scoped>
#parallaxPadding > .v-parallax__content {
  padding: 0px !important;
}
</style>
