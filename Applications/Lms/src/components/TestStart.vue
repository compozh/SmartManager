<template>
  <v-flex>
    Пройти тест
    <v-btn flat @click="start">Начать</v-btn>
  </v-flex>
</template>

<script>
export default {
  name: 'test-start',
  methods: {
    start() {
      this.$store.commit('lms/setCurrentTestPage', 'test-passing')
    }
  }
}
</script>

<style>

</style>
