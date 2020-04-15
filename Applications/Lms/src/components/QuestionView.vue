<template>
  <v-container>
    <v-layout column class="frame" px-2 v-if="question">
      <v-flex shrink>
        <v-btn round flat color="indigo" @click="goBackToQuestionsList">
          <v-icon left color="indigo">keyboard_arrow_left</v-icon>
          Вернуться к списку вопросов
        </v-btn>
      </v-flex>
      <v-flex>
        <!-- Вопрос и ответы -->
        <v-layout column>
          <v-flex>
            <!-- Вопрос -->
            <v-card flat>
              <v-layout class="frame">
                <v-flex shrink>
                  <v-card-text>
                    <v-avatar v-if="question.avatar">
                      <img :src="question.avatar" alt="avatar">
                    </v-avatar>
                    <v-avatar v-else :color="color">
                      <span class="white--text headline">{{question.authorName[0]}}</span>
                    </v-avatar>
                  </v-card-text>
                </v-flex>
                <v-flex>
                  <v-layout column>
                    <!-- Заголовок -->
                    <v-flex>
                      <v-layout fill-height align-start>
                        <v-flex py-1>
                          <v-layout column>
                            <v-flex grow>
                              <div class="body-2 indigo--text text-darken-1">{{question.title}}</div>
                            </v-flex>
                            <v-flex>
                              <div>
                                <span>{{question.authorName}}</span>
                                <span>&nbsp;|&nbsp;</span>
                                <span class="grey--text text-darken-1">{{question.prescription}}</span>
                              </div>
                            </v-flex>
                          </v-layout>
                        </v-flex>
                        <v-flex shrink px-2 py-1>
                          <div class="body-2 text-darken-1">{{question.dateTime}}</div>
                        </v-flex>
                      </v-layout>
                    </v-flex>
                    <!-- Тело -->
                    <v-flex>
                      <v-card-text>
                        <div v-html="question.content"></div>
                      </v-card-text>
                    </v-flex>
                    <!-- new position social counters -->
                    <v-flex>
                      <v-layout class="border-top">
                        <v-flex shrink>
                          <social-counter
                            :icon="likesIcon"
                            :vouts="question.voutsUpQty"
                            :iconColor="likesIconColor"
                            :voutsColor="likeColor"
                            @socialchange="onSocialChange(1)"></social-counter>
                        </v-flex>
                        <v-flex shrink>
                          <social-counter
                            :icon="dislikesIcon"
                            :vouts="question.voutsDownQty"
                            :iconColor="dislikesIconColor"
                            :voutsColor="dislikeColor"
                            @socialchange="onSocialChange(-1)"></social-counter>
                        </v-flex>
                      </v-layout>
                    </v-flex>
                  </v-layout>
                </v-flex>
              </v-layout>
            </v-card>
          </v-flex>
          <!-- Список ответов -->
          <v-flex>
            <v-card flat>
              <v-layout column class="frame">
                <v-flex>
                    <v-card-title>
                      <div class="body-2">Ответов: {{question.answers ? question.answers.length : 0}}</div>
                    </v-card-title>
                </v-flex>
                <v-flex>
                  <v-card flat v-if="question.answers">
                    <v-card-text>
                      <div v-for="answer in question.answers" :key="answer.id">
                        <answer-card :answer="answer"></answer-card>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-flex>
              </v-layout>
            </v-card>
          </v-flex>
          <!-- Редактор -->
          <v-flex py-2>
            <v-card flat>
              <quill v-model="content" output="html" :config="quillConfig" class="frame"></quill>
              <v-btn color="red lighten-2" dark @click="addAnswer">Ответить</v-btn>
            </v-card>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import Vue from 'vue'
import AnswerCard from './AnswerCard'
import {LmsApi as api} from '../api/lmsApi'
import {colors, randomColor, addPrescriptionToPost} from '../helpers/questions'

export default {
  name: 'question-view',
  components: {
    AnswerCard
  },
  async mounted() {
    // получить вопрос слушателя урока
    this.question = this.$store.state.lms.discussion
    const result = await api.fetchDiscassionOfLessonFromGql(this.question.id)
    Vue.set(this.question, 'content', result.data.lms.discussion.content)
    Vue.set(this.question, 'answers', result.data.lms.discussion.answers)
    this.addPrescriptionToPosts(result.data.lms.discussion)
  },
  data() {
    return {
      question: null,
      likesIconColor: 'primary',
      dislikesIconColor: 'error',
      likeColor: 'blue--text text-darken-1',
      dislikeColor: 'red--text text-darken-1',
      likesIcon: 'thumb_up_alt',
      dislikesIcon: 'thumb_down_alt',
      quillConfig: {
        readOnly: false,
        placeholder: 'Ваш ответ...',
        modules: {
          syntax: false,
          toolbar: [
            ['bold','italic','underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ list: 'ordered'}, { list: 'bullet' }],
            ['link', 'image'],
          ]
        },
        theme: 'snow',
      },
      content: '',
      colors: colors
    }
  },
  methods: {
    onSocialChange(vout) {
      this.$store.commit('lms/socialChange', vout)
    },

    addPrescriptionToPosts(discussion) {
      Vue.set(this.question, 'prescription', addPrescriptionToPost(discussion.dateTime))
      Vue.set(this.question, 'dateTime', new Date(discussion.dateTime).toLocaleString())
      // TODO: построить для ответов
      if (discussion.answers) {
        discussion.answers.forEach(a => {
          Vue.set(a, 'prescription', addPrescriptionToPost(a.dateTime))
          Vue.set(a, 'dateTime', new Date(a.dateTime).toLocaleString())
        })
      }
    },
    async addAnswer() {
      if (this.content) {
        const answer = {
          dateTime: new Date().toString(),
          authorName: this.user.userName,
          avatar: this.user.userPhoto,
          content: this.content,
          voutsUpQty: 0,
          voutsDownQty: 0,
          answersQty: 0
        }
        const lessonGuid = this.$store.getters['lms/currentLessonGuid']
        // TODO: 2020-04-07 заменить lessonGuid на lessonId
        //const unit = this.$store.getters['lms/unit']
        // const lessonId = unit.lesson.lessonId
        // отправить ответ на сервер
        try {
          const postResult = await api.addPostFromGql(this.user.id, lessonGuid, this.question.id, answer)
          answer.id = postResult.data.lmsMutation.addPost.id
          answer.prescription = addPrescriptionToPost(answer.dateTime)
          answer.dateTime = new Date(answer.dateTime).toLocaleString()
          this.question.answers.push(answer)
          // добавить новый ответ в список ответов вопроса
        } catch (error) {
          console.log(error)
          // TODO: сообщить, что ответ не добавлен и вывести ошибку
        }
        this.content = ''
      }
    },
    goBackToQuestionsList() {
      this.$store.commit('lms/setQuestionsView', 'questions-list')
    }
  },
  computed: {
    user() {
      return this.$store.getters['lms/user']
    },
    color() {
      return  randomColor(this.colors)
    }
  }
}
</script>

<style>

</style>
