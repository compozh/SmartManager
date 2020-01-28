<template>
	<v-container fluid px-0 py-0 mx-0 my-0>
		<!--COURSE HEADER-->
		<v-layout v-if="course">
			<v-flex xs12>
        <v-card >
          <v-breadcrumbs :items="links" divider=">"></v-breadcrumbs>
        </v-card>
				<v-card v-if="courseData" v-bind:style="{'background-color': courseData.backgroundColor}">
					<v-layout wrap row justify-center>
						<v-flex md1 xs2 class='pt-5' hidden-xs-only>
							<v-img v-bind:src='courseData.imageLink' height='90px' contain/>
						</v-flex>
						<v-flex lg6 md10 sm10 xs12>
							<v-card-title :class='courseData.courseNameInfoClass'>{{courseData.name}}</v-card-title>
							<v-card-text :class='courseData.courseDescriptionInfoClass'>{{courseData.description}}</v-card-text>
							<v-layout row wrap>
								<v-flex md3 xs6>
									<!-- <v-card-text :class='courseData.modulesQtInfoClass'>{{courseData.modulesQtLabel}}</v-card-text> -->
                  <!-- <v-card-text :class='courseData.courseDetailedDurationInfoClass'>{{courseData.durationMinutesLabel}}</v-card-text> -->
								</v-flex>
								<v-spacer/>
								<v-flex xs12>
									<v-layout align-top justify-end row wrap>
                    <v-btn v-if="course" @click="$router.push({name: 'LMSCOURSELEARNING',
                        params: {
                          courseGuid: course.courseGuid,
                          lessonGuid: currentLessonGuid,
                          course,
                          modules,
                          }})">Начать курс</v-btn>
									</v-layout>
								</v-flex>
							</v-layout>
						</v-flex>
					</v-layout>
				</v-card>
			</v-flex>
		</v-layout>
    <!-- Описание курса -->
    <!-- Статическая панель -->
    <v-layout align-center justify-center mx-2 mb-4 v-if="courseDescription">
      <v-flex lg8 mb10 sx12>
        <div v-for='item in courseDescription' :key="item.title">
          <v-card v-if="item.description">
            <v-card-title primary-title>
              <h3>{{item.title}}</h3>
            </v-card-title>
            <v-card-text v-html="item.description"></v-card-text>
          </v-card>
        </div>
      </v-flex>
    </v-layout>
    <!-- Сводка. Количественные характеристики -->
    <v-layout align-center justify-center mx-2 mb-4>
      <v-flex lg6 mb8 sm10 sx12>
        <v-card v-if="courseStatistics">
          <v-card-title>
            <h3>Этот курс включает</h3>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-list v-if="modules">
              <v-list-tile
                v-for="(item, index) in courseStatistics"
                :key="index">
                <v-list-tile-action>
                   <v-icon v-if="item.icon">{{item.icon}}</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title v-text="item.title + item.label"></v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>
          </v-card-text>
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
									<v-img v-bind:src='moduleItem.imageLink' height='80px' contain/>
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
								<v-btn flat color="teal darken-4" @click='$router.push(
                  {
                    name: "LMSMODULEDETAILS",
                    params: {
                      moduleGuid: moduleItem.moduleGuid,
                      moduleName: moduleItem.name,
                      moduleData: moduleItem
                    }
                  })'>Начать</v-btn>
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
import { getThisLink, getRoutesLinks } from '../helpers/navihelp.js'

export default {
  name: 'lms-course-details',
  data() {
    return {
      courseGuid: '',
      courseData: null,
      panel: [true],
    }
  },
  created() {
    this.courseGuid = this.$route.params.courseGuid
    if (this.$route.params.courseData) {
      this.courseData = this.$route.params.courseData
      this.getCourseDetails(this.courseGuid)
    } else {
      let courseDetails = this.$store.getters['lms/courseDetails']
      this.courseData = courseDetails.course
    }
    const course = this.courseData
    if (course.backgroundColor != undefined) {
      if (course.backgroundColor.toUpperCase() === '#FFFFFF') {
        course.courseTypeInfoClass = 'title font-weight-regular pt-4 pb-1 black--text'
        course.courseNameInfoClass = 'display-1 font-weight-medium pt-0 pb-2 black--text'
        course.courseDescriptionInfoClass = 'body-2 font-weight-medium pt-0 pb-3 black--text'
        course.courseDetailedDurationInfoClass = 'body-2 font-weight-medium pt-0 pb-4 black--text'
        course.durationInfoClass = 'black--text'
        course.modulesQtInfoClass = 'black--text mt-1 pb-1'
      } else {
        course.courseTypeInfoClass = 'title font-weight-regular pt-4 pb-1 white--text'
        course.courseNameInfoClass = 'display-1 font-weight-medium pt-0 pb-2 white--text'
        course.courseDescriptionInfoClass = 'body-2 font-weight-medium pt-0 pb-3 white--text'
        course.courseDetailedDurationInfoClass = 'body-2 font-weight-medium pt-0 pb-4 white--text'
        course.durationInfoClass = 'white--text'
        course.modulesQtInfoClass = 'white--text mt-1 pb-1'
      }
    }
  },
  methods: {
    getCourseDetails(courseGuid) {
      this.$store.dispatch('lms/getCourseDetails', courseGuid)
    }
  },
  computed: {
    modules () {
      const courseDetails =  this.$store.getters['lms/courseDetails']
      return courseDetails !== null ? courseDetails.modules : null
    },
    course() {
      const courseDetails =  this.$store.getters['lms/courseDetails']
      return courseDetails ? courseDetails.course : null
    },
    currentLessonGuid() {
      // STUB пока возвращать 1-й урок 1-го модуля
      const courseDetails =  this.$store.getters['lms/courseDetails']

      if (courseDetails) {
        const module1st = courseDetails.modules ? courseDetails.modules[0] : null
        if (module1st) {
          return module1st.units.length ? module1st.units[0].lessonGuid : ''
        } else {
          return ''
        }
      } else {
        return ''
      }
    },
    links() {
      const thisLink = getThisLink(this.$route.params.courseName, this.$route.path, true)
      let links = getRoutesLinks(this.$route.params.links, thisLink)
      return links
    },
    courseDescription() {
      const courseData = this.$store.getters['lms/courseDetails']
      if (courseData) {
        return [
          {
            title: 'Цели курса',
            description: courseData.course.coursGoals
          },
          {
            title: 'Для кого этот курс',
            description: courseData.course.audience
          },
          {
            title: 'Предварительная подготовка',
            description: courseData.course.entryLvl
          },
          {
            title: 'Приобретаемые знания',
            description: courseData.course.exitKnowledge
          },
          {
            title: 'Приобретаемые навыки',
            description: courseData.course.exitSkills
          }
        ]
      } else {
        return []
      }
    },
    courseStatistics() {
      const courseDetails =  this.$store.getters['lms/courseDetails']
      let statistic = []
      if (courseDetails) {
        let modulesLessons = courseDetails.modules.map(m => m.units.length)
        let lessonsQty = modulesLessons.reduce((total, current) => total + current)
        statistic = [
          {
            title: '',
            label: this.courseData.modulesQtLabel,
            icon: 'view_module'
          },
          {
            title: '',
            label: lessonsQty + ' уроков',
            icon: 'schedule'
          },
          {
            title: 'Общая продолжительность видео: ',
            label: this.courseData.durationMinutesLabel,
            icon: 'theaters'
          },
          {
            title: 'Практика:',
            label: '12 часов',
            icon: 'hourglass_empty'
          },
          {
            title: 'Материалов к урокам: ',
            label: '15',
            icon: 'attach_file'
          },
          {
            title: 'Тестов: ',
            label: '2',
            icon: 'done_outline'
          }
        ]
      }
      return statistic
    }
  }
}
</script>

<style scoped>

</style>
