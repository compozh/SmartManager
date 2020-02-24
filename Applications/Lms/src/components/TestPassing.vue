<template>
  <v-flex>
    <v-card >
      <v-layout column>
        <v-flex>
          <v-card>
            <v-card-title>
              Тест {{test}}
            </v-card-title>
          </v-card>
        </v-flex>
        <v-flex>
          <v-toolbar dense flat>
            <v-btn
              v-show="!isFirstQuestion"
              @click="prevQuestion">
              <v-icon left dark>keyboard_arrow_left</v-icon>
              <span class="hidden-sm-and-down">Предыдущий</span>
            </v-btn>
            <v-btn
              @click="sendAnswer"
              flat color="light-blue lighten-2">
              Ответить
            </v-btn>
            <v-btn
              v-show="!isLastQuestion"
              @click="nextQuestion">
              <v-icon right dark>keyboard_arrow_right</v-icon>
              <span class="hidden-sm-and-down">Следующий</span>
            </v-btn>
            <v-btn
              @click="finish"
              flat color="ligth-green lighten-2">
              Завершить
            </v-btn>
          </v-toolbar>
        </v-flex>
      </v-layout>
    </v-card>
  </v-flex>
</template>

<script>
export default {
  name: 'test-passing',
  methods: {
    prevQuestion() {},
    nextQuestion() {},
    sendAnswer() {},
    finish() {
      this.$store.commit('lms/setCurrentTestPage', 'test-results')
    }
  },
  computed: {
    isFirstQuestion() {
      return true
    },
    isLastQuestion() {
      return false
    },
    test() {
      return 'Что Вы знаете о MASTER?'
    }
  }
}
</script>

<style>

</style>
