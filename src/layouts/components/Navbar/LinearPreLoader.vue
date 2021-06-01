<template>
  <v-progress-linear
    :active="loading"
    :indeterminate="loading"
    absolute
    bottom
    color="primary"/>
</template>

<script>
export default {
  name: 'LinearPreLoader',
  computed: {
    loading () {
      return !!this.$store.state.app.linearPreLoaders.length
    }
  }
}
</script>

<style scoped>

</style>
