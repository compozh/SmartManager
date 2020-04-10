<template>
  <v-container fluid py-0>
    <v-layout fill-height>
      <v-flex grow>
        <v-card flat>
          <v-card-title>
            <p class="body-2 qa">Вопросы и ответы</p>
            <component v-bind:is="currentComponent"></component>
          </v-card-title>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>

export default {
  name: 'question-and-answers',
  data() {
    return {
    }
  },
  computed: {
    currentComponent() {
      return this.$store.getters['lms/currentQuestionsView']
    }
  }
}
</script>

<style>
.qa {
  width: 100%;
  height: 100%;
}
</style>
