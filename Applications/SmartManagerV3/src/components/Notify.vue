<template>
  <v-snackbar v-model="notify"
              bottom right
              :color="color"
              multi-line
              :timeout=5000>
    {{ text }}
    <v-btn dark text @click="notify = null">
      {{ $t('buttons.close') }}
    </v-btn>
  </v-snackbar>
</template>

<script>
export default {
  name: 'Notify',
  computed: {
    notify: {
      get () {
        return this.$store.state.app.notify
      },
      set () {
        this.$store.commit('SET_NOTIFY', null)
      }
    },
    color () {
      return this.notify && this.notify.color
        ? this.notify.color
        : 'secondary'
    },
    text () {
      return this.notify && this.notify.text
        ? this.notify.text
        : this.$t('messages.noMessages')
    }
  }
}
</script>

<style scoped>

</style>
