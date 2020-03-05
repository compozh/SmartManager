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
                      <v-layout fill-height align-center>
                        <v-flex>
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
                        <v-flex shrink>
                          <v-layout column>
                            <v-flex>
                              <social-counter
                                :icon="likesIcon"
                                :vouts="question.voutsDownQty"
                                :iconColor="likesIconColor"
                                :voutsColor="likeColor"></social-counter>
                            </v-flex>
                            <v-flex>
                              <social-counter
                                :icon="dislikesIcon"
                                :vouts="question.voutsDownQty"
                                :iconColor="dislikesIconColor"
                                :voutsColor="dislikeColor"></social-counter>
                            </v-flex>
                          </v-layout>
                        </v-flex>
                      </v-layout>
                    </v-flex>
                    <!-- Тело -->
                    <v-flex>
                      <v-card-text>
                        <div v-html="question.body"></div>
                      </v-card-text>
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
import AnswerCard from './AnswerCard'
import {LmsApi as api} from '../api/lmsApi'
import {colors, randomColor, addPrescriptionToPost} from '../helpers/questions'

export default {
  name: 'question-view',
  components: {
    AnswerCard
  },
  async mounted() {
    console.log('question-view mounted')
    // получить вопрос слушателя урока
    const courseDetails = this.$store.getters['lms/courseDetails']
    const currentLessonGuid = this.$store.getters['lms/currentLessonGuid']
    const questionId = this.$store.getters['lms/discussionId']
    const result = await api.fetchDiscassionOfLessonFromGql(courseDetails.course.courseGuid, currentLessonGuid, questionId)
    this.question = this.addPrescriptionToPosts(result.data.lms.discussion)
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
    addPrescriptionToPosts(discussion) {
      discussion.prescription = addPrescriptionToPost(discussion.dateTime)
      if (discussion.answers) {
        discussion.answers.forEach(a => a.prescription = addPrescriptionToPost(a.dateTime))
      }
      return discussion
    },
    addAnswer() {
      if (this.content) {
        const answer = {
          dateTime: new Date().toLocaleString(),
          authorName: this.user.userName,
          avatar: this.user.userPhoto,
          content: this.content,
          voutsUpQty: 0,
          voutsDownQty: 0,
          answersQty: 0
        }
        this.question.answers.push(answer)
        this.content = ''
        // отправить ответ на сервер
        // this.$store.dispatch('lms/saveAnswer', {courseGuid, lessonGuid, questionId: this.question.id})
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
