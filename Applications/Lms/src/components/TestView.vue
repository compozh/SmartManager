<template>
  <v-container>
    <v-layout>
      <component v-bind:is="currentComponent"></component>
    </v-layout>
  </v-container>
</template>

<script>
import testStart from './TestStart'
import testPassing from './TestPassing'
import testResults from './TestResults'

export default {
  name: 'test-view',
  props: {
    test: Object
  },
  created() {
    this.$store.commit('lms/setCurrentTestPage', 'test-start')
  },
  data() {
    return {
      components: [
        testStart,
        testPassing,
        testResults
      ],
      // STUB для уроков
      questions: [
        {
          id: 1,
          qtype: 1,
          qtext: 'Ваш рост',
          answered: '',
          isCorrect: '',
          isRequired: '',
          attributes: [
            {
              id: 10,
              title: '',
              rangeNumber: 0,
              rightAnswer: 0,
              answerDetail: '',
              typeField: 1,
              inputValue: '',
            },
            {
              id: 11,
              title: '',
              rangeNumber: 0,
              rightAnswer: 0,
              answerDetail: '',
              typeField: 1,
              inputValue: '',
            },
            {
              id: 12,
              title: '',
              rangeNumber: 0,
              rightAnswer: 0,
              answerDetail: '',
              typeField: 1,
              inputValue: '',
            }
          ]
        },
        {
          id: 2,
          qtype: 2,
          qtext: '',
          answered: '',
          isCorrect: '',
          isRequired: '',
          attributes: [
            {
              id: 21,
              title: '',
              rangeNumber: 0,
              rightAnswer: 0,
              answerDetail: '',
              typeField: 1,
              inputValue: '',
            },
            {
              id: 22,
              title: '',
              rangeNumber: 0,
              rightAnswer: 0,
              answerDetail: '',
              typeField: 1,
              inputValue: '',
            }
          ]
        },
        {
          id: 3,
          qtype: 1,
          qtext: '',
          answered: '',
          isCorrect: '',
          isRequired: '',
          attributes: [
            {
              id: 30,
              title: '',
              rangeNumber: 0,
              rightAnswer: 0,
              answerDetail: '',
              typeField: 1,
              inputValue: '',
            }
          ]
        }
      ]
    }
  },
  computed: {
    currentComponent() {
      let comp = this.$store.getters['lms/currentTestPage']
      return comp
    }
  }
}
</script>

<style>

</style>
