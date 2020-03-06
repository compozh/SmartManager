<template>
  <v-container>
    <v-layout column class="frame" px-2 v-if="questions">
      <v-flex>
        <v-layout align-center py-2>
          <v-flex>
            <v-btn
              color="info"
              @click="addQuestion">
              Задать вопрос
            </v-btn>
          </v-flex>
          <v-spacer></v-spacer>
          <v-flex shrink class="list-head body-2">Вопросов: {{questions.length}}</v-flex>
        </v-layout>
      </v-flex>
      <v-flex>
        <div v-for="question in questions" :key="question.id">
          <question-card
            :question="question"
            @click="goToQuestion(question)">
          </question-card>
        </div>
      </v-flex>
      <v-flex align-self-center>
        <v-btn flat color="info">Показать больше</v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>

export default {
  name: 'questions-list',
  methods: {
    goToQuestion(question) {
      // Установить текущий вопрос
      // перейти к представлению вопроса
      this.$store.commit('lms/setDiscussionId', question.id)
      this.$store.commit('lms/setQuestionsView', 'question-view')
    },
    addQuestion() {
      this.$store.commit('lms/setQuestionsView', 'new-question')
    }
  },
  computed: {
    questions() {
      return this.$store.getters['lms/discussions']
    }
  }
}
</script>

<style>
.frame {
  border: solid 1px lightgrey;
}
.list-head {
  padding-right: 1em;
}
</style>
