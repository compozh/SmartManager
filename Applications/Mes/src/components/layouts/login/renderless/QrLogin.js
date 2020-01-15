export default {
  name: 'QrLoginRl',

  //** Данные */
  data: () => ({
    error: '',
    state: '',
    result: '',
    processing: false
  }),


  render() {
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
    showScanner() {
      return !this.error && !this.result
    },
    routeToBack() {
      return this.$router.currentRoute.query.to
    }
  },

  i18n: {
    messages: {
      ru: {
        qrloginrl: {
          loginError: 'По данному коду не удалось войти в систему',
          notAllowedError: 'Для входа вам нужно дать разрешение на доступ к камере',
          notFoundError: 'На этом устройстве камера не обнаружена',
          streamApiNotSupportedError: 'Stream API не поддерживается в этом браузере. Попробуйте использовать GoogleChrome'
        }
      }
    }
  },

  methods: {
    tryAgain() {
      this.error = ''
      this.result = ''
    },
    onDecode (decodedString) {
      this.result = decodedString
      this.processing = true
      this.$authentication.loginByQr(this.result)
        .then(result => {
          this.processing = false
          result ? this.$router.replace({path: this.routeToBack}) : ''
        }).catch( () => {
          this.processing = false
          this.error = this.$t('qrloginrl.loginError')
        })
    },

    async onInit (promise) {
      try {
        await promise
      } catch (error) {
        if (error.name === 'NotAllowedError') {
          this.state = this.$t('qrloginrl.notAllowedError')
        } else if (error.name === 'NotFoundError') {
          this.state = this.$t('qrloginrl.notFoundError')
        } else if (error.name === 'NotSupportedError') {
          this.state = 'ERROR: secure context required (HTTPS, localhost)'
        } else if (error.name === 'NotReadableError') {
          this.state = 'ERROR: is the camera already in use?'
        } else if (error.name === 'OverconstrainedError') {
          this.state = 'ERROR: installed cameras are not suitable'
        } else if (error.name === 'StreamApiNotSupportedError') {
          this.state = this.$t('qrloginrl.streamApiNotSupportedError')
        }
      }
    }
  }

}