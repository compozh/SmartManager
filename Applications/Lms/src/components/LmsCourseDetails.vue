<template>
	<v-container fluid px-0 py-0 mx-0 my-0>
		<!--COURSE HEADER-->
		<v-layout >
			<v-flex xs12>
				<v-card v-if="course" v-bind:style="{'background-color': course.backgroundColor}">
					<v-layout wrap row justify-center>
						<v-flex md1 xs2 class='pt-5' hidden-xs-only>
							<v-card-media v-bind:src='course.imageLink' height='90px' contain/>
						</v-flex>
						<v-flex lg6 md10 sm10 xs12>
							<v-card-text :class='course.courseTypeInfoClass'>{{course.type}}</v-card-text>
							<v-card-title :class='course.courseNameInfoClass'>{{course.name}}</v-card-title>
							<v-card-text :class='course.courseDescriptionInfoClass'>{{course.description}}</v-card-text>
							<v-layout row wrap>
								<v-flex md3 xs6>
									<v-card-text :class='course.modulesQtInfoClass'>{{course.modulesQtLabel}}</v-card-text>
                  <v-card-text :class='course.courseDetailedDurationInfoClass'>{{course.durationMinutesLabel}}</v-card-text>
								</v-flex>
								<v-spacer/>
								<v-flex xs12>
									<v-layout align-top justify-start row wrap>
										<!-- <v-layout align-top justify-end row mx-3>
											<v-icon
												id='favIcon'
												v-bind:color='course.isFavorite ? "red" : "grey"'
												@mouseenter='favIconColor = "red"'
												@mouseleave='favIconColor = "white"'
												@click='changeFavoriteState(course)'>{{course.isFavorite === true ? 'favorite' : 'favorite_border'}}</v-icon>
										</v-layout> -->
									</v-layout>
								</v-flex>
							</v-layout>
						</v-flex>
					</v-layout>
				</v-card>
			</v-flex>
		</v-layout>

		<!--MODULES CONT-->
		<v-layout align-center justify-center mx-2 mt-4 mb-4>
			<v-flex lg6 md10 sm10 xs12>
				<v-layout wrap column v-if="modules">
					<v-flex v-for='moduleItem in modules' :key='moduleItem.moduleGuid'>
						<v-card class='my-2' hover >
							<v-layout row class='pb-0'>
								<v-flex xs2 md2 class='mt-2 ml-4 mr-2 mb-2'>
									<v-card-media v-bind:src='moduleItem.imageLink' height='80px' contain/>
								</v-flex>
								<v-flex xs10 class='mt-0'>
									<v-card-title primary-title >
										<v-layout align-start justify-end column>
											<div class='light-blue--text text--darken-4 title'>{{moduleItem.name}}</div>
											<div class='black--text pt-2'>{{moduleItem.description}}</div>
										</v-layout>
									</v-card-title>
								</v-flex>
							</v-layout>
							<v-layout reverse column>
								<v-flex xs12>
									<v-list two-line class='py-0 ml-0'>
										<v-list-group>
											<v-list-tile slot="activator" v-bind:style='{"height":"48px"}'>
												<v-list-tile-content class='pb-4'>
													<v-list-tile-title class='blue--text text--darken-4'>{{moduleItem.showLessonsTitle}}</v-list-tile-title>
												</v-list-tile-content>
											</v-list-tile>
											<v-list-tile v-for='lesson in moduleItem.units' :key='lesson.lessonGuid' @click='$router.push({name: "LMSLESSON", params: {
															lessonData: lesson,
															lessonName: lesson.name,
															moduleName: moduleItem.name,
															courseGuid: course.courseGuid,
															lessonGuid: lesson.lessonGuid,
														}})'>
												<v-list-tile-content class='pr-2'>
													<v-list-tile-title class='blue--text text--darken-4 font-weight-medium'>{{lesson.name}}</v-list-tile-title>
													<v-list-tile-sub-title>{{lesson.durationMinutesLabel}}</v-list-tile-sub-title>
												</v-list-tile-content>
												<v-list-tile-action>
													<v-btn icon ripple>
														<v-icon color="grey lighten-1">info</v-icon>
													</v-btn>
												</v-list-tile-action>
											</v-list-tile>
											<v-divider/>
										</v-list-group>
									</v-list>
								</v-flex>
							</v-layout>
							<v-card-actions>
								<v-btn flat color="teal darken-4" @click='$router.push({name: "LMSMODULEDETAILS", params: {moduleGuid: moduleItem.moduleGuid, moduleName: moduleItem.name, moduleData: moduleItem}})'>Начать</v-btn>
							</v-card-actions>
						</v-card>
					</v-flex>
				</v-layout>
			</v-flex>

			<v-flex xs3 class='py-5 px-4' v-if="course" v-show="course.additionalInfo">
				<h3>Про этот курс</h3>
				<p>{{course.additionalInfo}}</p>
			</v-flex>
		</v-layout>
	</v-container>
</template>

<script>

export default {
  name: "lms-course-details",
  data() {
    return {
      courseGuid : ""
    }
  },
  created() {
    this.courseGuid = this.$route.params.courseGuid
    this.getCourseDetails(this.courseGuid)
  },
  methods: {
    getCourseDetails(courseGuid) {
      const courseDetails = this.$store.getters['lms/courses']
      .finde(course => course.courseGuid === courseGuid)
      if(courseDetails) {
        commit('setCourseDetails', courseDetails)
      } else {
        this.$store.dispatch('lms/getCourseDetails', courseGuid)
      }
    }
  },
  computed: {
    modules () {
      const courseDetails =  this.$store.getters['lms/courseDetails']
      return courseDetails !== null ? courseDetails.modules : null
    },
    course() {
      var courseDetails =  this.$store.getters['lms/courseDetails']
      if (courseDetails) {
        var course = courseDetails.course

        if (course.backgroundColor != undefined) {
          if (course.backgroundColor.toUpperCase() === "#FFFFFF") {
            course.courseTypeInfoClass = "title font-weight-regular pt-4 pb-1 black--text"
			  		course.courseNameInfoClass = "display-1 font-weight-medium pt-0 pb-2 black--text"
			  		course.courseDescriptionInfoClass = "body-2 font-weight-medium pt-0 pb-3 black--text"
			  		course.courseDetailedDurationInfoClass = "body-2 font-weight-medium pt-0 pb-4 black--text"
			  		course.durationInfoClass = "black--text"
            course.modulesQtInfoClass = "black--text mt-1 pb-1"
          } else {
            course.courseTypeInfoClass = "title font-weight-regular pt-4 pb-1 white--text"
            course.courseNameInfoClass = "display-1 font-weight-medium pt-0 pb-2 white--text"
            course.courseDescriptionInfoClass = "body-2 font-weight-medium pt-0 pb-3 white--text"
            course.courseDetailedDurationInfoClass = "body-2 font-weight-medium pt-0 pb-4 white--text"
            course.durationInfoClass = "white--text"
            course.modulesQtInfoClass = "white--text mt-1 pb-1"
          }
        }
        return course
      } else {
        return null
      }
    }
  }
}
</script>

<style scoped>

</style>
