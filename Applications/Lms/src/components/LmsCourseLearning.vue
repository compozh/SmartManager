<template>
  <v-container fill-height fluid px-0 py-0 mx-0 my-0>
    <v-layout row wrap class="color-white" v-resize="hideSidebar">
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
                        :width="7"
                        :value="progressValue"
                        color="primary"
                      >
                        {{ progressValue }}
                      </v-progress-circular>
                    </v-flex>
                    <v-flex v-if="!menuOnRight" align-self-center>
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
              <v-flex>
                <v-card flat >
                  <lesson-view
                    class="lesson-view"
                    v-if='currentLesson'
                    :unit='currentLesson'
                    :startPlay="startPlay"
                    @ended="putNextLesson()"></lesson-view>
                </v-card>
                <v-flex>
                  <v-toolbar dense flat >
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
              </v-flex>
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
                            @change-list="updateLessonPaseedList"
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
      <v-flex v-if="menuOnRight" lg4 md8 sm12>
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
                @change-list="updateLessonPaseedList"></lessons-menu>
            </v-card>
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
import {lessonType, materialType} from '../helpers/lesson.js'

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
      courseGuid: '',
      course: {},
      modules: [],
      currentLessonGuid: '',
      menuOnRight: true,
      openItem: true,
      tabActive: null,
      tabItems: [
        { id: 'materials', title: 'Ресурсы', nestedView: LessonMaterials},
        { id: 'questions', title: 'Вопросы и ответы', nestedView: QuestionsAndAnswers}
      ],
      progress: {
        passed: 0,
        total: 29
      },
      lessonsPassed: [],
      modulesLessonsPassed: [],
      startPlay: false,
      navigation: {
        currentLessonIndex: 0,
        lessons: []
      }
    }
  },
  created() {
    this.course = this.$route.params.course
    this.courseGuid = this.$route.params.courseGuid
    this.modules = this.$route.params.modules
    this.currentLessonGuid = this.$route.params.lessonGuid
    this.putPassedFieldToLessons(this.modules)
    this.progress = this.getInitialProgress(this.modules)
    this.lessonPassed = this.getInitialPassedLesson(this.modules)
    this.getLesson(this.currentLessonGuid)
    // Получить все идентификаторы уроков
    this.navigation.lessons = this.getAllLessons()
    this.navigation.currentLessonIndex = this.getCurrentLessonIndex( this.currentLessonGuid )
  },
  mounted() {
    this.hideSidebar()
  },
  methods: {
    hideSidebar() {
      let breackPoint = this.$vuetify.breakpoint.name
      if (breackPoint === 'xs' || breackPoint === 'sm' || breackPoint === 'md') {
        this.closeMenuRight()
      }
    },
    nextLesson () {
      if (this.navigation.currentLessonIndex < this.navigation.lessons.length - 1) {
        this.navigation.currentLessonIndex++
        this.currentLessonGuid = this.navigation.lessons[this.navigation.currentLessonIndex].lessonGuid
      }
      const lessonId = this.navigation.lessons[this.navigation.currentLessonIndex]
      this.setCurrentLesson (lessonId)
    },
    prevLesson () {
      if (this.navigation.currentLessonIndex > 0) {
        this.navigation.currentLessonIndex--
        this.currentLessonGuid = this.navigation.lessons[this.navigation.currentLessonIndex].lessonGuid
      }
      const lessonId = this.navigation.lessons[this.navigation.currentLessonIndex]
      this.setCurrentLesson (lessonId)
    },
    setCurrentLesson (lessonGuid) {
      this.currentLessonGuid = lessonGuid
      this.navigation.currentLessonIndex = this.getCurrentLessonIndex(lessonGuid)
      this.getLesson(lessonGuid)
      window.scrollTo({top: 0, left: 0, behavior: 'smooth'})
    },
    async getLesson(lessonGuid) {
      // Получить урок
      await this.$store.dispatch('lms/getLessonContent', lessonGuid)
    },
    finishLesson () {
      let currentLessonGuid = this.currentLesson.lesson.lessonGuid
      if ( !this.lessonsPassed.includes(currentLessonGuid) ) {
        this.lessonsPassed.push(currentLessonGuid)
      }
      // отправить запрос на сервер (урок пройден)
      this.$store.dispatch('lms/fixLessonPassing', {currentLessonGuid, courseGuid: this.course.courseGuid})
    },
    putNextLesson () {
      this.finishLesson()
      this.nextLesson ()
      const currentLessonType = this.currentLesson.lesson.lessonType
      this.startPlay = currentLessonType === lessonType.video
    },
    // Навигация. Получить все уроки курса: идентификаторы и признак свободного доступа
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
      this.lessonsPassed = passedLessons
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
    updateLessonPaseedList(list) {
      this.finishLesson()
      this.lessonsPassed = list
    },
    // Заглушка для получения статуса урока пройден/непройден
    putPassedFieldToLessons(modules) {
      modules.forEach(m => m.active = true)
      for (const _module of modules) {
        _module.units.forEach(function (u) {
          u.passed = false
          u.disabled = false
          switch (u.lessonType) {
          case lessonType.video:
            u.icon = 'ondemand_video' // lessonIcons.video
            break
          case lessonType.text:
            u.icon = 'insert_drive_file' // lessonIcons.text
            break
          case lessonType.test:
            u.icon = 'playlist_add_check' // lessonIcons.test
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

      // unit.lesson.lessonType = 1
      // unit.content = 'https://m.it.ua/s00/ws/GetFile.ashx?file=_Z4DYZG0YD.mp4&folder=DOCS'

      // for (let i = 0; i < this.materials.length; i++) {
      //   const m = this.materials[i]
      //   if (m.enclosures) {
      //     m.enclosures.forEach(e => e.link = 'https://m.it.ua/s00/ws/GetFile.ashx?file=_Z4DYZG0YD.mp4&folder=DOCS')
      //   }
      // }
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
    }
  },
  computed: {
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
        return this.currentLesson.lesson.lessonGuid === this.navigation.lessons[0].lessonGuid
      } else {
        return false
      }
    },
    isLastLesson () {
      if ( this.currentLesson ) {
        return this.currentLesson.lesson.lessonGuid === this.navigation.lessons[this.navigation.lessons.length - 1].lessonGuid
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
.active {
  background: #E1F5FE;
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
  height: 65vh;
  overflow: hidden;
  border: solid lightgray 1px;
}
</style>
