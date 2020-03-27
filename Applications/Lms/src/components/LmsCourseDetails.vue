<template>
  <v-container fill-height fluid px-0 py-0 mx-0 my-0>
    <v-layout justify-center fill-height>
      <v-flex v-if="!circularLoader">
        <!--COURSE HEADER-->
        <v-layout>
          <v-flex xs12>
            <v-card v-if="links">
              <v-breadcrumbs  :items="links" divider=">" class="activelink">
                <template v-slot:item="{ item }">
                  <router-link :to="item.href" v-if="!item.disabled">{{item.text}}</router-link>
                  <span v-else class="disablelink">{{item.text}}</span>
                </template>
              </v-breadcrumbs>
            </v-card>
            <v-card v-if="course" v-bind:style="{'background-color': course.backgroundColor}">
              <v-layout wrap row justify-center>
                <v-flex md1 xs2 class='pt-5' hidden-xs-only>
                  <v-img v-bind:src='course.imageLink' height='90px' contain/>
                </v-flex>
                <v-flex lg6 md10 sm10 xs12>
                  <v-card-title :class='course.courseNameInfoClass'>{{course.name}}</v-card-title>
                  <v-card-text :class='course.courseDescriptionInfoClass'>{{course.description}}</v-card-text>
                  <v-layout row wrap>
                    <v-flex xs12>
                      <v-layout align-top justify-end row wrap>
                        <v-btn v-if="course && user"
                          :loading="loading"
                          :disabled="loading"
                          @click="startCourseLearning">
                          Начать курс
                        </v-btn>
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
        <v-layout align-center justify-center mx-2 mb-4 v-if="course && courseDescription">
          <v-flex lg8 mb10 sx12>
            <div v-for='item in courseDescription' :key="item.title">
              <v-card>
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
            <v-card v-if="course && courseStatistics">
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
                          <v-list-tile
                            v-for='lesson in moduleItem.units'
                            :key='lesson.lessonGuid'
                            @click='$router.push({name: "LMSLESSON", params: {
                                  lessonData: lesson,
                                  lessonName: lesson.name,
                                  moduleName: moduleItem.name,
                                  courseGuid: course.courseGuid,
                                  lessonGuid: lesson.lessonGuid,
                                }})'>
                            <v-list-tile-content class='pr-2'>
                              <v-list-tile-title class='blue--text text--darken-4 font-weight-medium'>
                                {{lesson.name}}
                              </v-list-tile-title>
                              <v-list-tile-sub-title>
                                {{lesson.durationMinutesLabel}}
                              </v-list-tile-sub-title>
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
      </v-flex>
      <v-flex v-else align-self-center>
        <v-layout align-center justify-space-between column fill-height>
          <v-flex >
            <v-progress-circular
              :value="80"
              :size="100"
              :width="10"
              indeterminate
              color="blue-grey">
            </v-progress-circular>
          </v-flex>
        </v-layout>
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
      loading: false,
      links: null
    }
  },
  created() {
    this.courseGuid = this.$route.params.courseGuid
    this.getCourseDetails(this.courseGuid)
    const thisLink = getThisLink(this.course.name, this.$route.path, true)
    this.links = getRoutesLinks(this.$route.params.links, thisLink)
  },
  methods: {
    getCourseDetails(courseGuid) {
      this.$store.dispatch('lms/getCourseDetails', courseGuid)
    },
    async startCourseLearning() {
      // Если слушатель еще не начал проходить курс
      if (!this.course.status) {
        this.$store.dispatch('lms/fixCourseStart', this.courseGuid)
        this.$store.commit('lms/setCurrentLessonGuid', this.modules[0].units[0].lessonGuid)
        this.$store.commit('lms/setTabActive', 'materials')
      } else {
        // получить
        this.loading = true
        await this.$store.dispatch('lms/restoreCourseLearningPageState', this.courseGuid)
        this.loading = false
      }
      this.$router.push({name: 'LMSCOURSELEARNING',
        params: {
          courseGuid: this.course.courseGuid,
          lessonGuid: this.currentLessonGuid,
        }})
    }
  },
  computed: {
    circularLoader() {
      return this.$store.getters['lms/circularLoader']
    },
    user() {
      return this.$store.getters['lms/user']
    },
    modules () {
      const courseDetails = this.$store.getters['lms/courseDetails']
      return courseDetails ? courseDetails.modules : null
    },
    course() {
      const courseDetails = this.$store.getters['lms/courseDetails']
      return courseDetails ? courseDetails.course : null
    },
    currentLessonGuid() {
      return this.$store.getters['lms/currentLessonGuid']
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
        ].filter(d => d.description)
      } else {
        return []
      }
    },
    courseStatistics() {
      const courseDetails =  this.$store.getters['lms/courseDetails']
      let statistic = []
      if (courseDetails) {
        let modulesLessons = courseDetails.modules.map(m => m.units.length)
        let lessonsQty = modulesLessons.reduce((total, current) => total + current, 0)
        statistic = [
          {
            title: '',
            label: courseDetails.course.modulesQtLabel,
            icon: 'view_module'
          },
          {
            title: '',
            label: 'Уроков: ' + lessonsQty,
            icon: 'schedule'
          },
          {
            title: 'Общая продолжительность видео: ',
            label: courseDetails.course.durationMinutesLabel,
            icon: 'theaters'
          },
          {
            title: 'Практика:',
            label: '',
            icon: 'hourglass_empty'
          },
          {
            title: 'Материалов к урокам: ',
            label: '',
            icon: 'attach_file'
          },
          {
            title: 'Тестов: ',
            label: '',
            icon: 'done_outline'
          }
        ]
      }
      return statistic.filter(s => s.label)
    }
  }
}
</script>

<style scoped>
.activelink {
  text-decoration: none;
}
.disablelink {
  color: grey;
}
</style>
