<template>
  <v-container>
    <v-layout column class="frame" px-2>
      <v-flex shrink>
        <v-btn round flat color="indigo" @click="goBackToQuestionsList">
          <v-icon left color="indigo">keyboard_arrow_left</v-icon>
          Вернуться к списку вопросов
        </v-btn>
      </v-flex>
      <v-flex px-2 py-2 class="frame">
        <v-text-field
          v-model="title"
          :counter="titleLimitLenght"
          :maxlength="titleLimitLenght"
          :rules="[rules.required(title, msg.required)]"
          hint="Введите заголовок вопроса: краткая и понятная всем формулировка."
          label="Заголовок вопроса"
          autofocus
          ></v-text-field>
      </v-flex>
      <v-flex py-2>
        <v-card flat>
          <quill v-model="content" output="html" :config="quillConfig" class="frame"></quill>
          <v-btn color="red lighten-2" dark @click="addQuestion">Добавить вопрос</v-btn>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { LmsApi as api } from '../api/lmsApi'

export default {
  name: 'new-question',
  data() {
    return {
      title: '',
      content: '',
      rules: {
        required: function (value, msg) { return !!value || msg }
      },
      msg: {
        required: 'Обязательно для ввода!'
      },
      titleLimitLenght: 150,
      quillConfig: {
        readOnly: false,
        placeholder: 'Изложите суть вопроса.',
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
      }
    }
  },
  methods: {
    goBackToQuestionsList() {
      this.$store.commit('lms/setQuestionsView', 'questions-list')
    },
    async addQuestion() {
      // выпролнить проверки
      if (this.title) {
        const question = {
          id: 0,
          dateTime: new Date().toString(),
          authorName: this.user.userName,
          avatar: this.user.userPhoto,
          title: this.title,
          content: this.content,
          voutsUpQty: 0,
          voutsDownQty: 0,
          answersQty: 0
        }
        const courseDetails = this.$store.getters['lms/courseDetails']
        const courseGuid = courseDetails.course.courseGuid
        const lessonGuid = this.$store.getters['lms/currentLessonGuid']
        // Отправить запрос на добавление вопроса
        try {
          const postResult = await api.addPostFromGql(courseGuid, lessonGuid, 0, question)
          question.id = postResult.data.lmsMutation.addPost.postId
          question.dateTime = new Date(question.dateTime).toLocaleString()
          // добавить новый вопрос в список
          this.$store.commit('lms/addDiscussion', question)
        } catch (error) {
          console.log(error)
          // TODO: сообщить, что вопрос не добавлен и вывести ошибку
          // перейти к списку вопросов
          this.goBackToQuestionsList()
        }
        // перейти к списку вопросов
        this.goBackToQuestionsList()
      }
    }
  },
  computed: {
    user() {
      return this.$store.getters['lms/user']
    }
  }
}
</script>

<style>

</style>
