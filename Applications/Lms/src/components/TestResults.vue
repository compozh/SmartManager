<template>
  <v-flex>
    Результаты
    <v-btn
      @click="passAgain"
      flat>
      Пройти повторно
    </v-btn>
  </v-flex>
</template>

<script>
export default {
  name: 'test-results',
  methods: {
    passAgain() {
      this.$store.commit('lms/setCurrentTestPage', 'test-start')
    }
  }
}
</script>

<style>

</style>
