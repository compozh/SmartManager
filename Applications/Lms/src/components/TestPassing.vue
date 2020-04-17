<template>
  <v-layout wrap fill-height ref="test">
    <v-flex class="width100 height100">
      <v-layout align-center column class="height100">
        <!-- Название -->
        <v-flex shrink class="width100">
          <v-card flat>
              <v-card-text v-if="commonInfo" class="test-title-colors">
                <v-layout >
                  <v-flex pr-1>
                    <div :class="{subheading: !mobile, 'body-2': mobile}">
                      {{commonInfo.surveyName}}
                    </div>
                  </v-flex>
                  <v-flex shrink pl-1>
                    <div class="text-center" :class="{subheading: !mobile, 'body-2': mobile}">
                      00:00:01
                    </div>
                  </v-flex>
                  <v-flex shrink v-if="!mobile">
                      <button
                        class="ml-2"
                        @click="toggleFullScreen">
                        <v-icon v-if="collapse" style="color:#fff;">fullscreen</v-icon>
                        <v-icon v-else style="color:#fff;">fullscreen_exit</v-icon>
                      </button>
                    </v-flex>
                </v-layout>
              </v-card-text>
          </v-card>
        </v-flex>
        <!-- слайдер -->
        <v-flex v-if="!mobile" shrink py-2 class="width100 border-bottom">
          <v-layout>
            <v-flex justify-content-start class="btn-list btn-list__max-height" ref="buttonlist">
                <button v-for="(question, index) in questions" :key="question.id"
                  class="btn-question"
                  :class="{'btn-current': !isAnswered(index) && currentQuestionNumber === index + 1, 'btn-answered': isAnswered(index)}"
                  @click="setCurrentQuestion(index)">
                  {{index + 1}}
                </button>
            </v-flex>
            <!-- открыть/закрыть слайдер  -->
            <button
              v-if="isSliderHeightOverflow"
              class="open-close-btn"
              @click="openCloseSlider">
              <v-icon>{{ sliderOpened ? 'keyboard_arrow_up' : 'keyboard_arrow_down' }}</v-icon>
            </button>
          </v-layout>
        </v-flex>
        <!-- кнопка слайдера (v.2) -->
        <!-- <v-flex v-else shrink class="width100 grey lighten-3">
          <v-toolbar-side-icon
              @click.stop='drawer = !drawer'>
          </v-toolbar-side-icon>
          <span>Вопросы</span>
        </v-flex> -->
        <!-- слайер с горизонтальным скролом (v.3) -->
        <v-flex v-if="mobile" shrink py-2 class="width100 border-bottom">
          <v-layout justify-content-start class="btn-list-mobile" ref="btnlistmobile">
            <!-- <div class="btn-list-mobile">
            </div> -->
            <button v-for="(question, index) in questions" :key="question.id"
              class="btn-question-mobile"
              :class="{'btn-current': !isAnswered(index) && currentQuestionNumber === index + 1, 'btn-answered': isAnswered(index)}"
              @click="setCurrentQuestion(index)">
              {{index + 1}}
            </button>
          </v-layout>
        </v-flex>
        <!-- вопрос -->
        <v-flex class="width100 overflow-scroll" mt-4>
          <v-layout column fill-height px-4>
            <v-flex shrink>
              <div
                :class="{subheading: !mobile, 'body-2': mobile}"
                v-html="question.qtext"></div>
            </v-flex>
            <v-flex>
                <div v-if="question.Type === 1">
                  <v-radio-group v-model="question.userChoice">
                    <v-radio class="caption"
                      v-for="attribute in question.Attributes"
                      :key="attribute.id"
                      :label="attribute.text"
                      :value="attribute.id">
                    </v-radio>
                  </v-radio-group>
                </div>
                <div v-if="question.Type === 2">
                  <v-checkbox
                    v-for="attribute in question.Attributes"
                    :key="attribute.id"
                    class="correct-margin"
                    :v-model="question.userChoice"
                    :label="attribute.text"
                    :value="attribute.id"></v-checkbox>
                </div>
            </v-flex>
          </v-layout>
        </v-flex>
        <!-- кнопки -->
        <v-flex shrink class="width100">
            <v-toolbar dense flat>
              <v-btn
                @click="finish"
                color="green lighten-4">
                <v-icon left dark>done_all</v-icon>
                <span class="hidden-sm-and-down">Завершить</span>
              </v-btn>
              <v-spacer />
              <v-btn
                @click="sendAnswer"
                color="light-blue lighten-4">
                <span class="hidden-sm-and-down">Ответить</span>
                <v-icon right dark>send</v-icon>
              </v-btn>
              <v-btn
                v-show="!isLastQuestion"
                @click="nextQuestion"
                color="grey lighten-2">
                <span class="hidden-sm-and-down">Пропустить</span>
                <v-icon right dark>keyboard_arrow_right</v-icon>
              </v-btn>
            </v-toolbar>
        </v-flex>
      </v-layout>
      <!-- боковой слайдер вопросов (v.2) -->
      <!-- <v-navigation-drawer
        v-if="mobile"
        v-model="drawer"
        absolute
        clipped
        temporery>
        <v-layout>
          <v-flex justify-content-start class="btn-list-free">
              <button v-for="(question, index) in questions" :key="question.id"
                class="btn-question"
                :class="{'btn-current': !isAnswered(index) && currentQuestionNumber === index + 1, 'btn-answered': isAnswered(index)}"
                @click="setCurrentQuestion(index)">
                {{index + 1}}
              </button>
          </v-flex>
        </v-layout>
      </v-navigation-drawer> -->
    </v-flex>
  </v-layout>
</template>

<script>

export default {
  name: 'test-passing',
  props: ['mobile'],
  data() {
    return {
      // drawer: false,
      collapse: true,
      expanedEl: null,
      slider: null,
      isSliderHeightOverflow: false,
      sliderOpened: false,
      btnWidth: 0.0,
      questions: [
        {
          id: 101,
          qtext: 'Сколько областей в Украине?',
          Type: 1,
          userChoice: 0,
          answered: false,
          Attributes: [
            {
              id: 1,
              text: '25'
            },
            {
              id: 2,
              text: '21'
            },
            {
              id: 3,
              text: '31'
            },
          ]
        },
        {
          id: 102,
          qtext: 'Отметьте притоки Днепра',
          Type: 2,
          userChoice: [],
          answered: false,
          Attributes: [
            {
              id: 5,
              text: 'Десна ДеснаДеснаДесна ДеснаДеснаДесна ДеснаДеснаДесна ДеснаДеснаДеснаДесна ДеснаДеснаДесна ДеснаДеснаДеснаДеснаДеснаДеснаДеснаДесна'
            },
            {
              id: 7,
              text: 'Черемош'
            },
            {
              id: 8,
              text: 'Сула'
            },
            {
              id: 9,
              text: 'Рось'
            },
            {
              id: 10,
              text: 'Днестр'
            },
            {
              id: 11,
              text: 'Южный буг'
            },
            {
              id: 12,
              text: 'Ирпень'
            },
            {
              id: 13,
              text: 'Кагамлык'
            },
            {
              id: 14,
              text: 'Припять'
            }
          ]
        },
        {
          id: 103,
          qtext: `В файле main.js в начале даны определения переменных:<br>
          <ul>
            <li>var amI = { name: 'John', age: 23}</li>
            <li>const person = { name: '', age: 0} </li>
            <li>let myFreand = { name: 'Andrew', age: 25}</li>
          </ul>
          Если в одной из функций определенных в этом файле будет такой код:<br>person = amI<br>pesson.name = amI.name<br>В каком месте программы произойдет ошибка?`,
          Type: 1,
          userChoice: 0,
          answered: false,
          Attributes: [
            {
              id: 1,
              text: 'Учитывая все выше изложенное: определения переменных и констант, фрагмент кода в функции (неважно где она определена, до или после определения переменных) можно с уверенностью сказать, что ошибка не возникнет. А если возникнет, то по другой причине.'
            },
            {
              id: 2,
              text: 'Ошибка возникнет в первой строке т.к. person - константа'
            },
            {
              id: 3,
              text: 'ошибка возникнет во второй втроке т.к. person - константа'
            },
          ]
        },
        {
          id: 105,
          qtext: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Rem eius explicabo sapiente exercitationem necessitatibus, corrupti adipisci magnam excepturi deleniti placeat illum sit minus delectus, amet est molestias, quis quo ipsam?',
          Type: 1,
          userChoice: 0,
          answered: false,
          Attributes: [
            {
              id: 1,
              text: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit.'
            },
            {
              id: 2,
              text: 'Rem eius explicabo sapiente exercitationem necessitatibus, corrupti adipisci magnam excepturi deleniti placeat illum sit minus delectus, amet est molestias, quis quo ipsam?'
            },
            {
              id: 3,
              text: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Rem eius explicabo sapiente'
            },
            {
              id: 4,
              text: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Rem eius explicabo sapiente и т.д. и т.п.'
            },
            {
              id: 5,
              text: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Rem eius explicabo sapiente. А шестерни деревянные, все-равно читать никто не будет'
            },
          ]
        },
        {
          id: 106,
          qtext: 'Вопрос по географии:<br>На каком континенте находится река Нил?',
          Type: 1,
          userChoice: 0,
          answered: false,
          Attributes: [
            {
              id: 1,
              text: 'Кто же не знает!<br>Нил находиться в Северной Америке'
            },
            {
              id: 2,
              text: 'Правильный ответ:<br>Африка'
            },
            {
              id: 3,
              text: 'Правильный ответ - Азия'
            },
          ]
        },
        {
          id: 107,
          qtext: 'Rem eius explicabo sapiente exercitationem necessitatibus, corrupti adipisci magnam excepturi deleniti placeat illum sit minus delectus, amet est molestias, quis quo ipsam?',
          Type: 1,
          userChoice: 0,
          answered: false,
          Attributes: [
            {
              id: 1,
              text: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Lorem, ipsum dolor sit amet consectetur adipisicing elit.'
            },
            {
              id: 2,
              text: 'Rem eius explicabo sapiente exercitationem necessitatibus'
            },
            {
              id: 3,
              text: 'Rem eius explicabo sapiente exercitationem necessitatibus, corrupti adipisci magnam excepturi deleniti placeat illum sit minus delectus'
            },
            {
              id: 4,
              text: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Rem eius explicabo sapiente exercitationem necessitatibus, corrupti adipisci magnam '
            },
          ]
        },
        {
          id: 108,
          qtext: 'Вопрос по географии:<br>На каком континенте находится река Нил?',
          Type: 1,
          userChoice: 0,
          answered: false,
          Attributes: [
            {
              id: 1,
              text: 'Rem eius explicabo sapiente exercitationem necessitatibus, corrupti adipisci magnam excepturi deleniti placeat illum sit minus delectus в Северной Америке'
            },
            {
              id: 2,
              text: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Rem eius explicabo sapiente exercitationem Африка'
            },
            {
              id: 3,
              text: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Rem eius explicabo sapiente exercitationem - Азия',
            },
            {
              id: 4,
              text: 'Австралия!!! - Lorem, ipsum dolor sit amet consectetur adipisicing elit. Rem eius explicabo sapiente exercitationem - Азия',
            },
            {
              id: 5,
              text: 'Антарктида!!! - Rem eius explicabo sapiente exercitationem. Lorem, ipsum dolor sit amet consectetur adipisicing elit.',
            },
          ]
        },
        {
          id: 109,
          qtext: 'Rem eius explicabo sapiente exercitationem.<br>Lorem, ipsum dolor sit amet consectetur adipisicing elit.<br>На каком континенте находится река Нил?',
          Type: 1,
          userChoice: 0,
          answered: false,
          Attributes: [
            {
              id: 1,
              text: 'eius explicabo sapiente exercitationem. eius explicabo sapiente exercitationem. Lorem, ipsum dolor sit amet consectetur adipisicing elit.'
            },
            {
              id: 2,
              text: 'Rem eius explicabo sapiente exercitationem. Lorem, ipsum dolor sit amet consectetur adipisicing elit.'
            },
            {
              id: 3,
              text: 'corrupti adipisci magnam excepturi deleniti placeat illum sit minus delectus, amet est molestias, quis quo ipsam'
            },
            {
              id: 4,
              text: 'corrupti adipisci magnam excepturi deleniti placeat illum sit minus delectus, amet est molestias, quis quo ipsam'
            },
            {
              id: 5,
              text: 'Rem eius explicabo sapiente exercitationem.<br>Lorem, ipsum dolor sit amet consectetur adipisicing elit.<br>На каком континенте находится река Нил'
            },
          ]
        },
        {
          id: 110,
          qtext: 'Вопрос по географии:<br>На каком континенте находится река Нил?',
          Type: 1,
          userChoice: 0,
          answered: false,
          Attributes: [
            {
              id: 1,
              text: 'Кто же не знает!<br>Нил находиться в Северной Америке'
            },
            {
              id: 2,
              text: 'Правильный ответ:<br>Африка'
            },
            {
              id: 3,
              text: 'Правильный ответ - Азия'
            },
          ]
        },
        {
          id: 111,
          qtext: 'Вопрос по географии:<br>На каком континенте находится река Нил?',
          Type: 1,
          userChoice: 0,
          answered: false,
          Attributes: [
            {
              id: 1,
              text: 'Кто же не знает!<br>Нил находиться в Северной Америке'
            },
            {
              id: 2,
              text: 'Правильный ответ:<br>Африка'
            },
            {
              id: 3,
              text: 'Правильный ответ - Азия'
            },
          ]
        },
      ],
      currentQuestionNum: 0
    }
  },
  created() {
    // STUB получить вопросы теста
    for (let i = 0; i < 25; i++) {
      this.questions.push({
        id: 160 + i,
        qtext: 'Вопрос №' + (i + 11),
        Type: 1,
        userChoice: 0,
        answered: false,
        Attributes: [
          {
            id: 1,
            text: 'Вариант 1'
          },
          {
            id: 2,
            text: 'Вариант 2'
          },
          {
            id: 3,
            text: 'Вариант 3'
          },
        ]
      })
    }
  },
  mounted() {
    if (!this.mobile) {
      this.expanedEl = this.$refs.test
      this.slider = this.$refs.buttonlist
      // определить переполнение слайдера по высоте
      this.checkHeightOverflowAfterResize()
      // добавить обработчик на изменение размеров экрана
      window.addEventListener('resize', this.checkHeightOverflowAfterResize)
    } else {
      this.slider = this.$refs.btnlistmobile
      const btn = document.getElementsByClassName('btn-question-mobile')[0]
      this.btnWidth = btn.offsetWidth
    }

    // инициализировать дополнительные поля
  },
  beforeDestroy() {
    if (!this.mobile) {
      window.removeEventListener('resize', this.checkHeightOverflowAfterResize)
    }
  },
  methods: {
    checkHeightOverflowAfterResize() {
      if (this.checkHeightOverflow(this.slider)) {
        this.isSliderHeightOverflow = true
      } else {
        this.isSliderHeightOverflow = false
      }
      console.log('resize', this.isSliderHeightOverflow)
    },
    checkHeightOverflow(el) {
      if (el) {
        return el.clientHeight - el.scrollHeight
      } else {
        return null
      }
    },
    openCloseSlider() {
      this.sliderOpened = !this.sliderOpened
      this.slider.classList.toggle('btn-list__max-height')
    },
    toggleFullScreen() {
      this.collapse = false
      var fullScreenElement =
        document.fullscreenElement || document.mozFullscreenElement || document.webkitFullscreenElement
      if (!fullScreenElement) {
        if (this.expanedEl.requestFullscreen) {
          this.expanedEl.requestFullscreen()
        } else if (this.expanedEl.mozRequestFullscreen) {
          this.expanedEl.mozRequestFullscreen
        } else if (this.expanedEl.webkitRequestFullScreen) {
          this.expanedEl.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT)
        }
      } else {
        this.collapse = true
        if (document.cancelFullScreen) {
          document.cancelFullScreen()
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen()
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen()
        }
      }
    },
    getTestQuestions(surveyId, userId) {
      this.$store.dispatch('lms/getTestQuestions', {surveyId, userId})
    },
    getQuestionById() {},
    setCurrentQuestion(index) {
      if (this.questions[index].answered) {
        return
      }
      this.currentQuestionNum = index
    },
    nextQuestion() {
      if (this.currentQuestionNum < this.questions.length) {
        this.currentQuestionNum++
      }
      if (this.mobile) {
        debugger
        let scroll =  this.currentQuestionNum * (this.btnWidth + 3)
        this.slider.scrollLeft = scroll
      }
    },
    sendAnswer() {
      // Отправить ответ
      this.questions[this.currentQuestionNum].answered = true
      // перейти к следующему неотвеченному вопросу
      this.nextQuestion()
    },
    finish() {
      this.$store.commit('lms/setCurrentTestPage', 'test-results')
    },
    isAnswered(index) {
      return this.questions[index].answered
    }
  },
  computed: {
    commonInfo() {
      return this.$store.getters['lms/testCommonInfo']
    },
    isFirstQuestion() {
      return true
    },
    isLastQuestion() {
      return false
    },
    currentQuestionNumber() {
      return this.currentQuestionNum + 1
    },
    question() {
      return this.questions[this.currentQuestionNum]
    }
  }
}
</script>

<style scoped>
.btn-list {
  margin-top: 0.2em;
  margin-bottom: 0.2em;
  margin-left: 1em;
  margin-right: 1em;
  flex-wrap: wrap;
  overflow: hidden;
}
.btn-list__max-height {
  max-height: 6.6em;
}
.btn-question {
  width: 3em;
  height: 3em;
  border-left: 2px solid lightgray;
  border-top:  2px solid lightgray;
  border-right: 2px solid grey;
  border-bottom: 2px solid grey;
  margin-top: 0.1em;
  margin-left:0.1em;
  margin-right: 0.1em;
  margin-bottom: 0.1em;
}
.btn-question:hover {
  background-color: lightgray;
}
.btn-question:focus, .open-close-btn:focus {
  outline:none;
}
.btn-current {
  background-color: sandybrown;
  color: #fff;
  font-weight: 600;
  border: 1px solid #f4a460;
}
.btn-answered {
  background-color:seagreen;
  color: #fff;
  font-weight: 600;
  border-right: 2px solid rgb(67, 204, 126);
  border-bottom: 2px solid rgb(67, 204, 126);
  border-top: 2px solid #1a5534fd;
  border-left: 2px solid #1a5534fd;
}
.btn-answered:hover {
  cursor:default;
}
.open-close-btn {
  background-color: darkgrey;
}
.border-bottom {
  border-bottom: 1px solid lightslategray;
}
.correct-margin {
  margin-bottom: -38px !important;
}
/* Mobile */
/* .btn-list-free {
  width: 6.8em;
  margin-top: 0.2em;
  margin-bottom: 0.2em;
  margin-left: 1em;
  margin-right: 1em;
  flex-wrap: wrap;
  overflow: auto;
} */
.btn-list-mobile {
  height: 3.4em;
  margin-top: 0.2em;
  margin-bottom: 0.2em;
  margin-left: 1em;
  margin-right: 1em;
  flex-wrap: nowrap;
  overflow-x: scroll;
 }
 .btn-question-mobile {
  flex: 0 0 auto;
  width: 3em;
  height: 3em;
  border-left: 2px solid lightgray;
  border-top:  2px solid lightgray;
  border-right: 2px solid grey;
  border-bottom: 2px solid grey;
  margin-top: 2px;
  margin-left: 2px;
  margin-right: 2px;
  margin-bottom: 2px;
 }
 .btn-question-mobile:focus {
  outline:none;
}
</style>
