<template>
    <v-snackbar
        v-model="show"
        bottom
        color="success"
        :timeout="timeout"
        >
        {{message}}
        <v-btn
            flat icon red
            @click="show = false">
            <v-icon v-text="'close'" />
        </v-btn>
    </v-snackbar>
</template>

<script>
export default {
  name: 'message-snackbar',
  data () {
    return {
      show: false,
      message: '',
      timeout: 6000,
    }
  },
  created: function () {
    this.$store.watch(state => state.purchases.snackbarMessage, this.callBack)
  },
  methods: {
    callBack() {
      const msg = this.$store.state.purchases.snackbarMessage
      if (msg !== '') {
        this.message = msg
        this.show = true
        this.$store.commit('purchases/setMessage', '')
      }
    }
  }
}
</script>



<style scoped>
</style>