<template>
  <v-container>
    <v-layout fill-height align-center justify-center column>
      <v-flex>
        <h2 v-if="error" class="title">Ошибка сервера!</h2>
        <p class="subheading red--text text--darken-4">{{errorMessage}}</p>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'error-message',
  computed: {
    error() {
      const error = this.$store.getters['lms/error']
      return error ? error.message : null
    },
    errorMessage() {
      const errMsg = this.$store.getters['lms/errorMessage']
      return errMsg
    }
  }
}
</script>

<style>

</style>
