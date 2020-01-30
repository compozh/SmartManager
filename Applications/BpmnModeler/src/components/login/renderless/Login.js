export default {
  name: 'loginRl',
  data: () => ({
    userData: {
      login: '',
      password: '',
      remember: false
    },
    message: '',
    loading: false

  }),
  computed: {
    routeToBack() {
      return this.$route.query.to || '/'
    },
    needEnterTempPassword() {
      // Не реализовано
      return false
    }
  },
  methods: {
    async login() {
      if (!this.userData.login) {
        return (this.message = this.$t('bpmn.authentication.emptyLogin'))
      }
      if (!this.userData.password) {
        return (this.message = this.$t('bpmn.authentication.emptyPassword'))
      }
      this.loading = true
      try {
        const result = await this.$store.dispatch('auth/login', this.userData)
        this.loading = false
        if (result.success) {
          await this.$router.replace({ path: this.routeToBack })
        } else {
          try {
            const resultMessage = JSON.parse(result.errorMessage.substring(result.errorMessage.indexOf(':') + 1));
            return (this.message = resultMessage.FAILREASON)
          } catch (error) {
            console.error(error);
            return (this.message = this.$t('bpmn.authentication.error'))
          }
        }
      } catch (e) {
        this.loading = false
        return (this.message = e || this.$t('bpmn.authentication.error'))
      }
    },
    GetRecoveryPasswordUrl() {
      console.log('функционал recovery password не реализован')
    }
  },
  created() {
    this.$store.dispatch('auth/logout')
  },
  render() {
    return this.$scopedSlots.default({
      userData: this.userData,
      message: this.message,
      needEnterTempPassword: this.needEnterTempPassword,
      loading: this.loading,
      params: {
        loginAttrs: {
          value: this.userData.login,
          label: this.$t('bpmn.authentication.userName'),
          title: this.$t('bpmn.authentication.userName'),
          required: true
        },
        loginEvents: {
          input: value => (this.userData.login = value),
          keydown: e => {
            if (e.key === 'Enter') {
              this.userData.login = e.target.value
              e.preventDefault()
              this.login()
            }
          }
        },
        passwordAttrs: {
          type: 'password',
          value: this.userData.password,
          label: this.$t('bpmn.authentication.password'),
          title: this.$t('bpmn.authentication.password'),
          required: true
        },
        passwordEvents: {
          input: value => (this.userData.password = value),
          keydown: e => {
            if (e.key === 'Enter') {
              this.userData.password = e.target.value
              e.preventDefault()
              this.login()
            }
          }
        },
        rememberAttrs: {
          value: this.userData.remember,
          label: this.$t('bpmn.authentication.rememberMe'),
          title: this.$t('bpmn.authentication.rememberMe')
        },
        rememberEvents: {
          change: () => (this.userData.remember = !this.userData.remember)
        },
        buttonAttrs: {
          value: this.userData.remember
        },
        buttonEvents: {
          click: () => this.login()
        },
        buttonEventRecoverPasswordUrl: {
          click: () => this.GetRecoveryPasswordUrl()
        },
        messageAttrs: {
          style: [{ display: this.message ? 'block' : 'none' }]
        }
      }
    })
  }
}
