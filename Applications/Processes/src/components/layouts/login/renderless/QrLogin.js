export default {
  name: 'QrLoginRl',

  data: () => ({
    error: '',
    state: '',
    result: '',
    processing: false
  }),

  render () {
    return this.$scopedSlots.default({
      readerEvents: {
        onDecode: this.onDecode,
        onInit: this.onInit,
        tryAgain: this.tryAgain
      },
      showScanner: this.showScanner,
      error: this.error,
      result: this.result,
      processing: this.processing,
      state: this.state
    })
  },

  computed: {
    showScanner () {
      return !this.error && !this.result
    },
    routeToBack () {
      return this.$router.currentRoute.query.to
    }
  },

  methods: {
    tryAgain () {
      this.error = ''
      this.result = ''
    },
    onDecode (decodedString) {
      this.result = decodedString
      this.processing = true

      this.$store.dispatch('loginByCode', this.result)
        .then(result => {
          this.processing = false

          if (result) {
            if (result.success) {
              this.$router.replace({ path: this.routeToBack })
            } else {
              this.error = result.errorMessage
            }
          } else {
            this.error = this.$t('processes.login.loginError')
          }
        }).catch(() => {
          this.processing = false
          this.error = this.$t('processes.login.loginError')
        })
    },

    async onInit (promise) {
      try {
        await promise
      } catch (error) {
        if (error.name === 'NotAllowedError') {
          this.state = this.$t('processes.login.notAllowedError')
        } else if (error.name === 'NotFoundError') {
          this.state = this.$t('processes.login.notFoundError')
        } else if (error.name === 'NotSupportedError') {
          this.state = 'ERROR: secure context required (HTTPS, localhost)'
        } else if (error.name === 'NotReadableError') {
          this.state = 'ERROR: is the camera already in use?'
        } else if (error.name === 'OverconstrainedError') {
          this.state = 'ERROR: installed cameras are not suitable'
        } else if (error.name === 'StreamApiNotSupportedError') {
          this.state = this.$t('processes.login.streamApiNotSupportedError')
        }
      }
    }
  }

}
