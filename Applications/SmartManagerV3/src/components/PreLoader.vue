<template>
  <v-overlay :value="preLoader" z-index="7" light>
    <v-progress-circular :size="70"
                         color="#5F81FF"
                         indeterminate>
      <v-img src="@/assets/logo.png" max-width="50"/>
    </v-progress-circular>
  </v-overlay>
</template>

<script>
export default {
  name: 'ThePreLoader',
  computed: {
    preLoader () {
      return this.$store.state.app.preLoaders.length
    }
  }
}
</script>

<style scoped>

</style>
