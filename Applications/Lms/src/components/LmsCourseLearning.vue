<template>
  <v-container fill-height fluid px-0 py-0 mx-0 my-0>
    <!-- Desctop -->
    <v-layout v-if="!(mobile && isTest)" row nowrap class="color-white" v-resize="hideSidebar">
      <!-- Заголовок курса, урока, прогресс
            Урок, панель навигации по урокам
            Закладки: ресурсы, вопросы и ответы -->
      <v-flex>
        <v-layout column fill-height>
          <!-- Заголовк курса и прогресс -->
          <v-flex shrink>
            <v-layout row justify-space-around class="color-grey">
                <v-flex align-self-center>
                  <v-card flat color="grey lighten-2">
                      <div class="title px-3 pt-2">{{course.name}}</div>
                    <div
                      v-if='currentLesson'
                      class="body-1 px-3 pb-2">
                      <span class="indigo--text">{{currentLesson.lesson.name}}</span>
                    </div>
                  </v-card>
                </v-flex>
                <v-spacer></v-spacer>
                <v-flex align-self-center shrink>
                  <v-layout fill-height justify-space-around align-center>
                    <v-flex fill-height hidden-sm-and-down align-self-center>
                      <div>Ваш прогресс: {{lessonsPassedQty + ' из ' + progress.total}}</div>
                    </v-flex>
                    <v-flex align-self-center mx-2>
                      <v-progress-circular
                        :rotate="-90"
                        :size="42"
                        :width="5"
                        :value="progressValue"
                        color="primary"
                        class="progress-label-size"
                      >
                        {{ progressValue }}
                      </v-progress-circular>
                    </v-flex>
                    <v-flex v-if="!menuOnRight && !isMobile" align-self-center>
                      <v-btn
                        @click="openMenuRight"
                        round
                        flat
                        outline
                        small color="grey darken-4" dark>
                        Материалы курса
                      </v-btn>
                    </v-flex>
                  </v-layout>
                </v-flex>
            </v-layout>
          </v-flex>
          <!-- Урок и панель навигации -->
          <v-flex >
            <v-layout column>
              <!-- <v-flex> -->
                <!-- <v-card flat > -->
                  <lesson-view
                    class="lesson-view"
                    v-if='currentLesson'
                    :unit='currentLesson'
                    :startPlay="startPlay"
                    @ended="putNextLesson()"></lesson-view>
                <!-- </v-card> -->
                <!-- панель управления -->
                <v-flex>
                  <v-toolbar dense flat v-if="!isTest">
                    <v-btn
                      v-show="!isFirstLesson"
                      @click="prevLesson()"
                      flat>
                      <v-icon left dark>keyboard_arrow_left</v-icon>
                      <span class="hidden-sm-and-down">Предыдущий урок</span>
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn
                      :disabled="(isTest && !testIsPassed) || lessonIsPassed"
                      @click="finishLesson()"
                      flat color='info'>
                      Завершить
                    </v-btn>
                    <v-btn
                      v-show="!isLastLesson"
                      @click="nextLesson()"
                      flat>
                      <span class="hidden-sm-and-down">Следующий урок</span>
                      <v-icon right dark>keyboard_arrow_right</v-icon>
                    </v-btn>
                  </v-toolbar>
                </v-flex>
              <!-- </v-flex> -->
              <!-- Табы -->
              <v-layout  justify-center>
                <v-flex>
                  <v-tabs
                    v-model="tabActive"
                    color="grey"
                    dark
                    slider-color="blue">
                    <v-tab
                      v-for="tabItem in tabItems"
                      :key="tabItem.id"
                      ripple>
                      {{ tabItem.title }}
                    </v-tab>
                    <v-tabs-items>
                      <v-tab-item
                        v-for="tabItem in tabItems"
                        :key="tabItem.id">
                        <v-card flat>
                          <lessons-menu
                            v-if="tabItem.id==='menu'"
                            :modules="modules"
                            :currentLessonId="currentLessonGuid"
                            :passedList="lessonsPassed"
                            @set-current-lesson="setCurrentLesson"
                            @change-list="updateLessonPassedList"
                            ></lessons-menu>
                          <lesson-materials
                            v-if='tabItem.id==="materials" && currentLesson'
                            :lesson="currentLesson.lesson"
                            :materials="currentLesson.lessonmaterials"></lesson-materials>
                          <questions-and-answers
                            v-if='tabItem.id==="questions"'></questions-and-answers>
                        </v-card>
                      </v-tab-item>
                    </v-tabs-items>
                  </v-tabs>
                </v-flex>
              </v-layout>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-flex>
      <!-- Навигационное меню -->
      <v-flex v-if="menuOnRight" grow lg4>
        <v-layout column fill-height>
          <v-flex grow>
            <v-card flat height='100%' width='100%'>
              <v-layout row align-center space-between nowrap pr-1 py-1>
                <v-flex>
                  <h3 class="px-3">Материалы курса</h3>
                </v-flex>
                <v-flex hidden-md-and-down shrink>
                  <v-btn @click="closeMenuRight"
                    flat icon color="grey">
                    <v-icon>close</v-icon>
                  </v-btn>
                </v-flex>
              </v-layout>
              <!-- Навигация -->
              <lessons-menu
                :modules="modules"
                :currentLessonId="currentLessonGuid"
                :passedList="lessonsPassed"
                @set-current-lesson="setCurrentLesson"
                @change-list="updateLessonPassedList"></lessons-menu>
            </v-card>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
    <!-- Mobile -->
    <v-layout v-if="mobile && isTest" column fill-height class="color-white">
      <!-- Название курса, прогрес -->
      <v-flex shrink>
        <v-layout row justify-space-around class="color-grey">
          <v-flex align-self-center class="title-container">
            <v-card flat color="grey lighten-2">
              <div class="title-no-wrap body-2 px-2 py-1 ">{{course.name}}</div>
            </v-card>
          </v-flex>
          <v-spacer></v-spacer>
          <!-- class="progress-container" -->
          <v-flex align-self-center>
            <v-layout fill-height justify-space-around align-center>
              <v-flex align-self-center mx-2 py-1>
                <v-progress-circular
                  :rotate="-90"
                  :size="30"
                  :width="3"
                  :value="progressValue"
                  color="primary"
                  class="progress-label-size-smal"
                >
                  {{ progressValue }}
                </v-progress-circular>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-flex>
      <!-- Окно урока/материалов/меню уроков (управление табами) -->
      <v-flex grow>
        <!-- Тест -->
        <v-layout column fill-height>
          <lesson-view
            v-if='currentLesson && activeMobileTab === "test"'
            class="lesson-view"
            :unit='currentLesson'
            :startPlay="startPlay"
            @ended="putNextLesson()">
          </lesson-view>
          <lessons-menu
            v-if="activeMobileTab === 'menu'"
            :modules="modules"
            :currentLessonId="currentLessonGuid"
            :passedList="lessonsPassed"
            @set-current-lesson="setCurrentLesson"
            @change-list="updateLessonPassedList"
            ></lessons-menu>
          <lesson-materials
            v-if='activeMobileTab === "materials" && currentLesson'
            :lesson="currentLesson.lesson"
            :materials="currentLesson.lessonmaterials"></lesson-materials>
          <questions-and-answers
            v-if='activeMobileTab === "questions"'></questions-and-answers>
        </v-layout>
      </v-flex>
      <!-- табы -->
      <v-flex shrink>
        <v-layout class="grey">
          <v-flex shrink
            v-for="(tab, index) in mobileTabs" :key="index"
            class="tab-mobile"
            :class="{activetab: tab.active}"
            @click="activateTab(index)">
            {{tab.title}}
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import LessonView from './LessonView.vue'
import LessonsMenu from './LessonsMenu.vue'
import LessonMaterials from './LessonMaterials.vue'
import QuestionsAndAnswers from './QuestionsAndAnswers.vue'
import { LmsApi as api } from '../api/lmsApi'
import {lessonType, materialType, lessonIcons} from '../helpers/lesson'
import { isMobile } from '../helpers/application'

export default {
  name: 'lms-course-learning',
  components: {
    LessonView,
    LessonsMenu,
    LessonMaterials,
    QuestionsAndAnswers
  },
  data() {
    return {
      mobile: false,
      courseGuid: '',
      menuOnRight: true,
      openItem: true,
      tabActive: null,
      tabItems: [
        { id: 'materials', title: 'Ресурсы', nestedView: LessonMaterials},
        { id: 'questions', title: 'Вопросы и ответы', nestedView: QuestionsAndAnswers}
      ],
      activeMobileTab: 'test',
      mobileTabs: [
        { id: 'test', title: 'Тест', active: true},
        { id: 'menu', title: 'Уроки', active: false},
        { id: 'materials', title: 'Ресурсы', active: false},
        { id: 'questions', title: 'Вопросы и ответы', active: false}
      ],
      progress: {
        passed: 0,
        total: 29
      },
      lessonsPassed: [],
      startPlay: false,
      navigation: {
        currentLessonIndex: 0,
        lessons: []
      }
    }
  },
  created() {
    this.mobile = isMobile()
    this.courseGuid = this.$route.params.courseGuid
    this.activeMobileTab = 'test'
    // this.tabActive = this.$store.getters['lms/tabActive']
    this.progress = this.getInitialProgress(this.modules)
    this.lessonsPassed = this.getInitialPassedLesson(this.modules)
    this.hideSidebar()
    this.putPassedFieldToLessons(this.modules)
    this.getLesson(this.$route.params.lessonGuid)
    // Получить все идентификаторы уроков
    this.navigation.lessons = this.getAllLessons()
    this.navigation.currentLessonIndex = this.getCurrentLessonIndex( this.$route.params.lessonGuid )
    this.$store.dispatch('lms/getDiscussionList', this.$route.params.lessonGuid)
    // TODO: 2020-04-07 Заменить lessonGuid на lessonId
    // this.$store.dispatch('lms/getDiscussionList', this.unit.lesson.lessonId)
    this.$store.commit('lms/setQuestionsView', 'questions-list')
  },
  beforeDestroy() {
    this.savePageState()
  },
  methods: {
    savePageState() {
      const pageState = { currentLessonGuid: this.currentLessonGuid, activeTab: this.tabActive}
      api.savePageStateFromGql(this.course.courseGuid, JSON.stringify(pageState))
    },
    hideSidebar() {
      let breackPoint = this.$vuetify.breakpoint.name
      if (breackPoint === 'xs' || breackPoint === 'sm' || breackPoint === 'md') {
        this.closeMenuRight()
      }
    },
    nextLesson () {
      if (this.navigation.currentLessonIndex < this.navigation.lessons.length - 1) {
        this.navigation.currentLessonIndex++
        this.$store.commit('lms/setCurrentLessonGuid',
          this.navigation.lessons[this.navigation.currentLessonIndex].lessonGuid)
      }
      const lessonId = this.navigation.lessons[this.navigation.currentLessonIndex]
      this.setCurrentLesson (lessonId)
    },
    prevLesson () {
      if (this.navigation.currentLessonIndex > 0) {
        this.navigation.currentLessonIndex--
        // NEW 2020-03-26
        this.$store.commit('lms/setCurrentLessonGuid', this.navigation.lessons[this.navigation.currentLessonIndex].lessonGuid)
      }
      const lessonId = this.navigation.lessons[this.navigation.currentLessonIndex]
      this.setCurrentLesson (lessonId)
    },
    setCurrentLesson (lessonGuid) {
      this.$store.commit('lms/setCurrentLessonGuid', lessonGuid)
      this.navigation.currentLessonIndex = this.getCurrentLessonIndex(lessonGuid)
      this.getLesson(lessonGuid)
      window.scrollTo({top: 0, left: 0, behavior: 'smooth'})
      this.$store.dispatch('lms/getDiscussionList', lessonGuid)
      this.$store.commit('lms/setQuestionsView', 'questions-list')
      this.$router.push({name: 'LMSCOURSELEARNING',
        params: {
          courseGuid: this.courseGuid,
          lessonGuid: lessonGuid,
        }})
    },
    getLesson(lessonGuid) {
      // Получить урок
      this.$store.dispatch('lms/getLessonContent', lessonGuid)
    },
    finishLesson () {
      let currentLessonGuid = this.currentLesson.lesson.lessonGuid
      if ( !this.lessonsPassed.includes(currentLessonGuid) ) {
        this.lessonsPassed.push(currentLessonGuid)
      }
      // отправить запрос на сервер (урок пройден)
      this.$store.dispatch('lms/fixLessonPassing', { courseGuid: this.courseGuid, lessonGuid: currentLessonGuid})
    },
    putNextLesson () {
      this.finishLesson()
      this.nextLesson ()
      const currentLessonType = this.currentLesson.lesson.lessonType
      this.startPlay = currentLessonType === lessonType.video
    },
    // Навигация. Получить  идентификаторы всех уроков курса
    getAllLessons () {
      let allLessonsInfo = []
      this.modules.forEach(m => {
        allLessonsInfo = allLessonsInfo.concat(m.units)
      })
      let allLessons = allLessonsInfo.map(l => l.lessonGuid)
      return allLessons
    },
    getCurrentLessonIndex (currentLessonGuid) {
      let index = this.navigation.lessons.indexOf(currentLessonGuid)
      return index === -1 ? 0 : index
    },
    // Общее количество пройденных уроков. Инициализация
    getInitialPassedLesson(modules) {
      const allLessons = modules.map(m => m.units)
      let passedLessons = []
      for (let i = 0; i < allLessons.length; i++) {
        let lessons = allLessons[i].filter(l => l.passed)
        let lessonsGuid = lessons.map(l => l.lessonGuid)
        passedLessons = passedLessons.concat(lessonsGuid)
      }
      return passedLessons
    },
    getInitialProgress(modules) {
      const modulesLessons = modules.map(m => m.units.length)
      let lessonsTotal = modulesLessons.reduce((total, current) => total + current)
      let lessonPassed = 0
      for (const m of modules) {
        let passedLessonInModule = m.units.filter(l => l.passed)
        lessonPassed += passedLessonInModule.length
      }
      return {total: lessonsTotal, passed: lessonPassed}
    },
    updateLessonPassedList(list) {
      this.finishLesson()
      this.lessonsPassed = list
    },
    //
    putPassedFieldToLessons(modules) {
      modules.forEach(m => m.active = true)
      for (const _module of modules) {
        _module.units.forEach(function (u) {
          u.disabled = false
          switch (u.lessonType) {
          case lessonType.video:
            u.icon = lessonIcons.video
            break
          case lessonType.text:
            u.icon = lessonIcons.text
            break
          case lessonType.test:
            u.icon = lessonIcons.test
          }
        })
      }
    },
    getMaterials(unit) {
      const lessonmaterials = unit.lessonmaterials
      let typeOfMaterials = new Set()
      lessonmaterials.forEach(item => {
        if (item.link) {
          typeOfMaterials.add(item.type)
        }
      })
      let materials = []
      typeOfMaterials.forEach(type => {
        let item = {
          active: true,
          type: type,
          title: '',
          icon: '',
          enclosures: [],
        }
        switch (type) {
        case materialType.file:
          item.title = 'Файлы'
          item.icon = 'attachment'
          item.enclosures = lessonmaterials.filter(l => l.type === type && l.link).map(i => {
            return {title: i.name, link: i.link}
          })
          break
        case materialType.presentation:
          item.title = 'Презентации'
          item.icon = 'slideshow'
          item.enclosures = lessonmaterials.filter(l => l.type === type && l.link).map(i => {
            return {title: i.name, link: i.link}
          })
          break
        case materialType.link:
          item.title = 'Ссылки'
          item.icon = 'open_in_new'
          item.enclosures = lessonmaterials.filter(l => l.type === type && l.link).map(i => {
            return {title: i.name, link: i.link}
          })
          break
        default:
          break
        }
        materials.push(item)
      })
      unit.lessonmaterials = materials
      return unit
    },
    closeMenuRight() {
      if (this.menuOnRight) {
        const lessonsMenu = { id: 'menu', title: 'Уроки', nestedView: LessonsMenu}
        this.tabItems.unshift(lessonsMenu)
        this.menuOnRight = !this.menuOnRight
      }
    },
    openMenuRight() {
      this.menuOnRight = !this.menuOnRight
      this.tabItems.shift()
    },
    activateTab(index) {
      this.mobileTabs.forEach(t => t.active = false)
      this.mobileTabs[index].active = true
      this.activeMobileTab = this.mobileTabs[index].id
    }
  },
  computed: {
    isMobile() {
      let breackPoint = this.$vuetify.breakpoint.name
      return breackPoint === 'xs' || breackPoint === 'sm'
    },
    course() {
      const courseDetails = this.$store.getters['lms/courseDetails']
      return courseDetails ? courseDetails.course : null
    },
    modules () {
      const courseDetails = this.$store.getters['lms/courseDetails']
      return courseDetails ? courseDetails.modules : null
    },
    currentLessonGuid() {
      return this.$store.getters['lms/currentLessonGuid']
    },
    isTest() {
      if (this.currentLesson) {
        return this.currentLesson.lesson.lessonType === lessonType.test
      } else {
        return false
      }
    },
    testIsPassed() {
      return this.lessonsPassed
    },
    lessonIsPassed() {
      if (this.currentLesson) {
        return this.lessonsPassed.includes(this.currentLesson.lesson.lessonGuid)
      } else {
        return false
      }

    },
    isFirstLesson () {
      if ( this.currentLesson ) {
        return this.currentLessonGuid === this.navigation.lessons[0]
      } else {
        return false
      }
    },
    isLastLesson () {
      if ( this.currentLesson ) {
        return this.currentLessonGuid === this.navigation.lessons[this.navigation.lessons.length - 1]
      } else {
        return false
      }
    },
    lessonsPassedQty() {
      return this.lessonsPassed.length
    },
    progressValue() {
      let value = this.progress.total
        ? Math.round(this.lessonsPassedQty / this.progress.total * 100) : 0
      return value + '%'
    },
    currentLesson() {
      const unit = this.$store.getters['lms/unit']
      return unit ? this.getMaterials(unit) : null
    }
  },
  filters: {
    timeFormat(value) {
      let minutesVal = value % 60
      let hoursVal = Math.floor(value / 60)
      let minutesStr = minutesVal.toString()
      let hoursStr = hoursVal.toString()
      let hourse = hoursStr.length > 1 ? hoursStr : '0' + hoursStr
      let minutes = minutesStr.length > 1 ? minutesStr : '0' + minutesStr
      return `${hourse}:${minutes}`
    }
  }
}
</script>

<style>
.color-white {
  background-color:white;
}
.color-grey {
  background-color: #E0E0E0;
}
.lesson-item {
  border-top: solid 1px #E0E0E0;
  cursor: pointer;
}
.lesson-item:hover {
  background: #EEEEEE;
}
.lesson-view {
  width:100%;
  height: 60vh;
  border: solid lightgray 1px;
}
.progress-label-size {
  font-size: 85%;
}
.progress-label-size-smal {
  font-size: 65%;
}
.title-container {
  width:85%;
}
.title-no-wrap {
  max-height: 2em;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.tab-mobile {
  min-width: 2em;
  padding: 2px 0.5em;
  text-transform: uppercase;
  /* background-color: darkgray; */
}
.activetab {
  color:#fff;
  border-bottom: solid 2px darkcyan;
}
</style>
