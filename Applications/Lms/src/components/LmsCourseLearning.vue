<template>
  <v-container fill-height fluid px-0 py-0 mx-0 my-0>
    <v-layout fill-height class="bgcolor">
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
                        <div>Ваш прогресс: {{progress.passed + ' из ' + progress.total}}</div>
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
              <v-flex grow md9 xs12>
                <v-tabs
                  v-model="active"
                  color="grey"
                  dark
                  slider-color="blue">
                  <v-tab
                    v-for="tabItem in tabItems"
                    :key="tabItem.title"
                    ripple>
                    {{ tabItem.title }}
                  </v-tab>
                  <v-tab-item
                    v-for="tabItem in tabItems"
                    :key="tabItem.title">
                    <v-card flat>
                      <lesson-view v-if='tabItem.id==="l"' :lesson='lesson'></lesson-view>
                      <lesson-materials v-if='tabItem.id==="m" && lesson' :lessonMaterials="lesson.materials"></lesson-materials>
                      <questions-and-answers v-if='tabItem.id==="q"'></questions-and-answers>
                    </v-card>
                  </v-tab-item>
                </v-tabs>
              </v-flex>
              <!-- Навигация -->
              <v-flex md3 xs12>
                <v-card flat height='100%' width='100%'>
                  <v-card-title >
                    <h3>Программа курса: <span class="indigo--text">{{course.name}}</span></h3>
                  </v-card-title>
                  <v-card-text>
                    <v-list>
                      <v-list-group
                        v-for="moduleItem in modules"
                        :key="moduleItem.id"
                        v-model="moduleItem.active"
                        no-action
                      >
                      <!-- :prepend-icon="item.action" -->
                        <template v-slot:activator>
                          <v-list-tile>
                            <v-list-tile-content>
                              <v-list-tile-title>{{ moduleItem.name }}</v-list-tile-title>
                            </v-list-tile-content>
                          </v-list-tile>
                        </template>
                        <v-list-tile
                          v-for="lesson in moduleItem.units"
                          :key="lesson.id"
                          @click="getLesson(lesson.lessonGuid)"
                        >
                          <v-list-tile-content>
                            <v-list-tile-title>{{ lesson.name }}</v-list-tile-title>
                          </v-list-tile-content>
                          <v-list-tile-action>
                            <!-- <v-icon>{{ subItem.action }}</v-icon> -->
                          </v-list-tile-action>
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

export default {
  name: 'lms-course-learning',
  components: {
    LessonView,
    LessonMaterials,
    QuestionsAndAnswers
  },
  data() {
    return {
      active: null,
      tabItems: [
        { id: 'l', title: 'Урок', nestedView: LessonView}, // 'Урок', 'Обзор', 'Вопросы и ответы'
        { id: 'm', title: 'Материалы урока', nestedView: LessonMaterials},
        { id: 'q', title: 'Вопросы и ответы', nestedView: QuestionsAndAnswers}
      ],
      progress: {
        passed: 10,
        total: 29
      },
      course: {},
      modules: [],
      lesson: {},

      // STUB materials
      materials: [
          {
            title: 'Презентация',
            type: 1,
            icon: 'slideshow',
            enclosures: [
              {title: 'Конфiгурування. Частина 1', link: ''}
            ]
          },
          {
            title: 'Практика',
            type: 2,
            icon: 'attachment',
            enclosures: null
          },
          {
            title: 'Файлы',
            type: 2,
            icon: 'attachment',
            enclosures: [
              {title: 'Определения', link: ''},
              {title: 'Програмнi продукти', link: ''}
            ]
          },
          {
            title: 'Ссылки',
            type: 3,
            icon: 'open_in_new',
            enclosures: [
              {title: 'Определения', link: ''},
              {title: 'Програмнi продукти', link: ''}
            ]
          }
      ],
      // quilljs config
      config: {
        readOnly: true,
        placeholder: "",
        modules: {
          syntax: false,
          toolbar: false
        },
        theme: "snow",
      },
    }
  },
    created() {
    this.course = this.$route.params.course
    this.modules = this.$route.params.modules
    this.currentLessonGuid = this.$route.params.currentLessonGuid
    this.getLesson(this.currentLessonGuid)
  },
  methods: {
    getLesson(lessonGuid) {
      for (let i = 0; i < this.modules.length; i++) {
        let curModule = this.modules[i].units;
        let les = curModule.find(l => l.lessonGuid === lessonGuid)
        if (!!les) {
          this.getMaterials(les)
          this.lesson = les
          return
        }
      }
      this.lesson = null
    },
    getMaterials(lesson) {
      lesson.type = 'video',
      lesson.content = 'https://m.it.ua/s00/ws/GetFile.ashx?file=_Z4DYZG0YD.mp4&folder=DOCS'
      for (let i = 0; i < this.materials.length; i++) {
        const m = this.materials[i];
        if(m.enclosures) {
          m.enclosures.forEach(e => e.link = 'https://m.it.ua/s00/ws/GetFile.ashx?file=_Z4DYZG0YD.mp4&folder=DOCS');
        }
      }
      lesson.materials = this.materials
    }
  },
  computed: {
    progressValue() {
      let value = this.progress.total
        ? Math.round(this.progress.passed / this.progress.total * 100) : 0
      return value + '%'
    },

  }
}
</script>

<style>
.border-red {
  border: solid red 1px;
}
.bgcolor {
  background-color:white;
}
</style>
