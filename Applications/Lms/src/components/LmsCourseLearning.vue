<template>
  <v-container fill-height fluid px-0 py-0 mx-0 my-0>
    <v-layout fill-height class="white">
      <v-flex>
        <v-layout>
          <v-flex>
            <!-- Заголовк курса и прогресс -->
            <v-layout row wrap fill-height justify-space-around>
              <!-- Заголовок -->
              <v-flex md9 xs10 align-self-center>
                <v-card flat>
                  <v-card-title>
                    <div class="headline">{{course.name}}</div>
                  </v-card-title>
                </v-card>
              </v-flex>

              <!-- Прогресс прохождения -->
              <v-flex md3 xs2>
                <v-card flat>
                  <v-card-text px-2 py-2>
                    <v-layout fill-height justify-space-around align-center>
                      <v-flex hidden-xs-only align-self-center>
                        <div>Ваш прогресс: {{lessonsPassedQty + ' из ' + progress.total}}</div>
                      </v-flex>
                      <v-flex align-self-center>
                        <v-progress-circular
                          :rotate="-90"
                          :size="54"
                          :width="9"
                          :value="progressValue"
                          color="primary"
                        >
                          {{ progressValue }}
                        </v-progress-circular>
                      </v-flex>
                    </v-layout>
                  </v-card-text>
                </v-card>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>

        <v-layout fill-height >
          <!-- Содержание курса: урок, обзор, вопросы и ответы + навигация -->
          <v-flex>
            <v-layout row wrap>
              <v-flex grow xl8 md7 sm12>
                <v-layout column>
                  <v-flex grow>
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
                          <lesson-view
                            v-if='tabItem.id==="lesson" && currentLesson'
                            :unit='currentLesson'
                            :startPlay="startPlay"
                            @ended="putNextLesson" />
                          <lesson-materials
                            v-if='tabItem.id==="materials" && currentLesson'
                            :lesson="currentLesson.lesson"
                            :materials="currentLesson.materials" />
                          <questions-and-answers v-if='tabItem.id==="questions"'></questions-and-answers>
                        </v-card>
                      </v-tab-item>
                    </v-tabs>
                  </v-flex>
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
                        v-show="currentTabName === 'lesson'"
                        :disabled="isTest || testIsPassed || lessonIsPassed"
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
                </v-layout>
              </v-flex>
              <!-- Навигация -->
              <v-flex xl4 md5 sm12>
                <v-card flat height='100%' width='100%'>
                  <v-card-title >
                    <h3>Программа курса:</h3>
                  </v-card-title>
                  <v-card-text style="margin-top:-16px;">
                    <v-list expand>
                      <v-list-group
                        v-for="moduleItem in modules"
                        :key="moduleItem.id"
                        v-model="moduleItem.active"
                        no-action
                      >
                        <template v-slot:activator>
                          <v-list-tile class="grey lighten-2">
                            <v-list-tile-content>
                              <v-list-tile-title class="subheading font-weight-bold">{{ moduleItem.name }}</v-list-tile-title>
                              <v-list-tile-title>
                                {{ moduleItem.durationMinutesLabel + ` (${lessonsModulePassed(moduleItem.moduleGuid)} / ${moduleItem.units.length})`}}
                              </v-list-tile-title>
                            </v-list-tile-content>
                          </v-list-tile>
                        </template>
                        <v-list-tile
                          v-for="lesson in moduleItem.units"
                          :key="lesson.id"
                          :data-guid="lesson.lessonGuid"
                          @click="setLesson(lesson)"
                          :class="{active: lesson.lessonGuid === currentLessonGuid}"
                        >
                          <v-list-tile-action>
                            <v-checkbox
                              v-model='lessonsPassed'
                              :value="lesson.lessonGuid"
                              :disabled="lesson.disabled"
                              ></v-checkbox>
                          </v-list-tile-action>
                          <v-list-tile-action>
                            <v-icon>{{lesson.icon}}</v-icon>
                          </v-list-tile-action>
                          <v-list-tile-action class="body-2">
                            {{lesson.durationMunute | timeFormat}}
                          </v-list-tile-action>
                          <v-list-tile-content>
                            <div class="body-2">{{ lesson.name }}</div>
                          </v-list-tile-content>
                        </v-list-tile>
                      </v-list-group>
                    </v-list>
                  </v-card-text>
                </v-card>
              </v-flex>
           </v-layout>
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
      tabActive: null,
      tabItems: [
        { id: 'lesson', title: 'Урок', nestedView: LessonView}, // 'Урок', 'Материалы урока', 'Вопросы и ответы'
        { id: 'materials', title: 'Материалы урока', nestedView: LessonMaterials},
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
        currentLessonIndex: 0,
        lessons: []
      },
      // STUB materials
      materials: [
        {
          title: 'Презентация',
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
      return false
    },
    lessonIsPassed () {
      return this.lessonsPassed.includes(this.currentLesson.lesson.lessonGuid)
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
.bg-color-white {
  background-color:white;
}
.active {
  background: #E1F5FE;
}
</style>
