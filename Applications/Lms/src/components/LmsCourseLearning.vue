<template>
  <v-container fill-height fluid px-0 py-0 mx-0 my-0>
    <v-layout row wrap class="color-white">
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
                    <v-flex v-if="!menuRight" align-self-center>
                      <v-btn
                        @click="menuRight=true"
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
                  <lesson-view v-if='currentLesson' :unit='currentLesson'></lesson-view>
                </v-card>
                <v-flex>
                  <v-toolbar dense flat>
                    <v-btn
                      v-show="!isFirstLesson"
                      @click="prevLesson()"
                      flat>
                      <v-icon left dark>keyboard_arrow_left</v-icon>
                      Предыдущий урок
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
                      Следующий урок
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
                      :key="tabItem.title"
                      @click="setCurrentTabName(tabItem.id)"
                      ripple>
                      {{ tabItem.title }}
                    </v-tab>
                    <v-tab-item
                      v-for="tabItem in tabItems"
                      :key="tabItem.title">
                      <v-card flat>
                        <lesson-materials v-if='tabItem.id==="materials" && currentLesson' :lesson="currentLesson.lesson" :materials="currentLesson.materials"></lesson-materials>
                        <questions-and-answers v-if='tabItem.id==="questions"'></questions-and-answers>
                      </v-card>
                    </v-tab-item>
                  </v-tabs>
                </v-flex>
              </v-layout>

            </v-layout>
          </v-flex>
        </v-layout>
      </v-flex>
      <!-- Навигационное меню -->
      <v-flex v-if="menuRight" lg4 md8 sm12>
        <v-layout column fill-height>
          <!-- Навигация -->
          <v-flex grow>
            <v-card flat height='100%' width='100%'>
              <v-layout row align-center space-between nowrap pr-1 py-1>
                <v-flex>
                  <h3 class="px-3">Материалы курса</h3>
                </v-flex>
                <v-flex hidden-md-and-down shrink>
                  <v-btn @click="menuRight=!menuRight"
                    flat icon color="grey">
                    <v-icon>close</v-icon>
                  </v-btn>
                </v-flex>
              </v-layout>
              <!-- Список уроков по модулям -->
              <v-layout fill-height>
                <v-flex>
                  <v-card
                    color="grey lighten-2"
                    flat
                    v-for="(moduleItem, index) in modules" :key="moduleItem.moduleGuid">
                    <div class="pl-3 pt-1">
                      <v-layout nowrap align-center justify-space-between>
                        <v-flex>
                          <div class="subheading font-weight-bold">{{moduleItem.name}}</div>
                          <div class="body-1">
                            {{ moduleItem.durationMinutesLabel + ` (${lessonsModulePassed(moduleItem.moduleGuid)} / ${moduleItem.units.length})`}}
                          </div>
                        </v-flex>
                        <v-spacer></v-spacer>
                        <v-flex shrink>
                          <v-btn icon @click="openClose(index)" color="white">
                            <v-icon>{{ isActive(index) ? 'keyboard_arrow_down' : 'keyboard_arrow_up' }}</v-icon>
                          </v-btn>
                        </v-flex>
                      </v-layout>
                    </div>
                    <v-card-text v-show="isActive(index)" class="white py-0 px-0">
                      <v-layout>
                        <v-flex>
                          <div
                              v-for="lesson in moduleItem.units"
                              :key="lesson.lessonGuid"
                              @click="setLesson(lesson)"
                              :class="{'active': lesson.lessonGuid === currentLessonGuid}"
                              class="lesson-item">
                            <v-layout nowrap justify-start>
                              <v-flex pl-3 shrink align-self-center>
                                <v-checkbox
                                  v-model="lessonsPassed"
                                  :value="lesson.lessonGuid"
                                  :disabled="lesson.disabled"
                                  height="6">
                                </v-checkbox>
                              </v-flex>
                              <v-flex>
                                <v-layout column>
                                  <v-flex>
                                    <v-layout>
                                      <v-flex align-self-center>
                                        <div><span class="grey--text text--darken-2">{{lesson.name}}</span></div>
                                      </v-flex>
                                    </v-layout>
                                  </v-flex>
                                </v-layout>
                                <v-layout nowrap>
                                  <v-flex shrink>
                                    <v-icon small color="grey lighten-1">{{lesson.icon}}</v-icon>
                                  </v-flex>
                                  <v-flex>
                                    <span class="ml-3 caption grey--text text-darken-1">{{lesson.durationMunute | timeFormat}}</span>
                                  </v-flex>
                                </v-layout>
                              </v-flex>
                            </v-layout>
                          </div>
                        </v-flex>
                      </v-layout>
                    </v-card-text>
                  </v-card>
                </v-flex>
              </v-layout>
            </v-card>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import LessonView from './LessonView.vue'
import LessonMaterials from './LessonMaterials.vue'
import QuestionsAndAnswers from './QuestionsAndAnswers.vue'
import {lessonType} from '../helpers/lesson.js'

export default {
  name: 'lms-course-learning',
  components: {
    LessonView,
    LessonMaterials,
    QuestionsAndAnswers
  },
  data() {
    return {
      menuRight: true,
      openItem: true,
      tabActive: null,
      tabItems: [
        { id: 'materials', title: 'Ресурсы', nestedView: LessonMaterials},
        { id: 'questions', title: 'Вопросы и ответы', nestedView: QuestionsAndAnswers}
      ],
      currentTabName: 'lesson',
      progress: {
        passed: 0,
        total: 29
      },
      course: {},
      modules: [],
      lesson: {},
      lessonsPassed: [],
      modulesLessonsPassed: [],
      currentLessonGuid: '',
      startPlay: false,
      navigation: {
        modules: [],
        currentLessonIndex: 0,
        lessons: []
      },
      // STUB materials
      materials: [
        {
          title: 'Презентации',
          type: 1,
          icon: 'slideshow',
          enclosures: [
            {title: 'Конфiгурування. Частина 1', link: ''}
          ],
          active: true
        },
        {
          title: 'Практика',
          type: 2,
          icon: 'attachment',
          enclosures: null,
          active: true
        },
        {
          title: 'Файлы',
          type: 2,
          icon: 'attachment',
          enclosures: [
            {title: 'Определения', link: ''},
            {title: 'Програмнi продукти', link: ''}
          ],
          active: true
        },
        {
          title: 'Ссылки',
          type: 3,
          icon: 'open_in_new',
          enclosures: [
            {title: 'Определения', link: ''},
            {title: 'Програмнi продукти', link: ''}
          ],
          active: true
        }
      ],
      // STUB иконки для типов уроков
      lessonIcons: [
        {
          lessonType: lessonType.text,
          icon: 'insert_drive_file'
        },{
          lessonType: lessonType.video,
          icon: 'ondemand_video'
        },{
          lessonType: lessonType.test,
          icon: 'playlist_add_check'
        }
      ]
    }
  },
  created() {
    this.course = this.$route.params.course
    this.modules = this.$route.params.modules
    this.currentLessonGuid = this.$route.params.lessonGuid
    this.putPassedFieldToLessons(this.modules)
    this.progress = this.getInitialProgress(this.modules)
    this.lessonPassed = this.getInitialPassedLesson(this.modules)
    // признак свободного доступа к уроку
    // isLessonFree(this.currentLessonGuid)
    // STUB признак прохождения урока пока добавлять программно
    const isFree = true
    this.getLesson(this.currentLessonGuid, isFree)
    this.navigation.modules = this.initMenu()
    // Получить все идентификаторы уроков
    this.navigation.lessons = this.getAllLessons()
    this.navigation.currentLessonIndex = this.getCurrentLessonIndex( this.currentLessonGuid )
  },
  methods: {
    nextLesson () {
      if (this.navigation.currentLessonIndex < this.navigation.lessons.length - 1) {
        this.navigation.currentLessonIndex++
        this.currentLessonGuid = this.navigation.lessons[this.navigation.currentLessonIndex].lessonGuid
      }
      const lesson = this.navigation.lessons[this.navigation.currentLessonIndex]
      this.setLesson (lesson)
    },
    prevLesson () {
      if (this.navigation.currentLessonIndex > 0) {
        this.navigation.currentLessonIndex--
        this.currentLessonGuid = this.navigation.lessons[this.navigation.currentLessonIndex].lessonGuid
      }
      const lesson = this.navigation.lessons[this.navigation.currentLessonIndex]
      this.setLesson (lesson)
    },
    setLesson ({lessonGuid, isFree}) {
      this.navigation.currentLessonIndex = this.getCurrentLessonIndex(lessonGuid)
      this.currentLessonGuid = this.navigation.lessons[this.navigation.currentLessonIndex].lessonGuid
      this.getLesson(lessonGuid, isFree)
    },
    async getLesson(lessonGuid, isFree) {
      // Получить урок
      await this.$store.dispatch('lms/getLessonContent', { lessonGuid, isFree })
    },
    finishLesson () {
      if ( !this.lessonsPassed.includes(this.currentLesson.lesson.lessonGuid) ) {
        this.lessonsPassed.push(this.currentLesson.lesson.lessonGuid)
      }
      // отправить запрос на сервер (урок пройден)

    },
    putNextLesson () {
      this.nextLesson ()
      this.startPlay = true
    },
    // Навигация. Получить все уроки курса: идентификаторы и признак свободного доступа
    getAllLessons () {
      let allLessonsInfo = []
      this.modules.forEach(m => {
        allLessonsInfo = allLessonsInfo.concat(m.units)
      })
      let allLessons = allLessonsInfo.map(l => {
        return { lessonGuid: l.lessonGuid, isFree: l.isFree}
      })
      return allLessons
    },
    getCurrentLessonIndex (currentLessonGuid) {
      return this.navigation.lessons.findIndex(l => l.lessonGuid === currentLessonGuid)
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
    // Заглушка для получения статуса урока пройден/непройден
    putPassedFieldToLessons(modules) {
      modules.forEach(m => m.active = true)
      for (const _module of modules) {
        _module.units.forEach(function (u) {
          u.lessonType = lessonType.video
          u.passed = false
          u.disabled = false
          u.isFree = true
          switch (u.lessonType) {
          case lessonType.video:
            u.icon = 'ondemand_video'
            break
          case lessonType.text:
            u.icon = 'insert_drive_file'
            break
          case lessonType.test:
            u.icon = 'playlist_add_check'
          }
        })
      }
      modules[0].units[0].passed = true
      modules[0].units[0].disabled = false
      modules[0].units[0].isFree = true
    },
    getMaterials(unit) {
      unit.lesson.lessonType = 1
      unit.content = 'https://m.it.ua/s00/ws/GetFile.ashx?file=_Z4DYZG0YD.mp4&folder=DOCS'
      for (let i = 0; i < this.materials.length; i++) {
        const m = this.materials[i]
        if (m.enclosures) {
          m.enclosures.forEach(e => e.link = 'https://m.it.ua/s00/ws/GetFile.ashx?file=_Z4DYZG0YD.mp4&folder=DOCS')
        }
      }
      unit.materials = this.materials
      return unit
    },
    lessonsModulePassed(moduleGuid) {
      const moduleItem = this.modules.find(m => m.moduleGuid === moduleGuid)
      let lessonModulePassed = 0
      for (let i = 0; i < this.lessonsPassed.length; i++) {
        if (moduleItem.units.some(u => u.lessonGuid === this.lessonsPassed[i])) {
          lessonModulePassed++
        }
      }
      return lessonModulePassed
    },
    setCurrentTabName ( tabActive ) {
      this.currentTabName = tabActive
    },
    isCurrentLesson(lessonGuid) {
      return this.currentLessonGuid === lessonGuid
    },
    initMenu() {
      return this.modules.map( m => {
        return {
          moduleGuid: m.moduleGuid,
          active: true
        }
      })
    },
    openClose(index) {
      this.navigation.modules[index].active = !this.navigation.modules[index].active
    },
    isActive(index) {
      return this.navigation.modules[index].active
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
</style>
