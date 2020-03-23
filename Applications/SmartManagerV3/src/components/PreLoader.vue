<template>
  <v-overlay app :value="preLoader">
    <v-progress-circular
      :size="50"
      color="primary"
      indeterminate
    >
      <v-img src="@/assets/logo.png"/>
    </v-progress-circular>
  </v-overlay>
</template>

<script>
export default {
  name: 'ThePreLoader',
  computed: {
    preLoader () {
      return this.$store.state.app.preLoader
    }
  }
}
</script>

<style scoped>

</style>
