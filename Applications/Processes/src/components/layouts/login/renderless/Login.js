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
    routeToBack () {
      return this.$router.currentRoute.query.to || '/'
    },
    needEnterTempPassword () {
      // Не реализовано
      return false
    }
  },
  methods: {
    async login () {
      if (!this.userData.login) {
        return (this.message = this.$t('authentication.emptyLogin'))
      }
      if (!this.userData.password) {
        return (this.message = this.$t('authentication.emptyPassword'))
      }
      this.loading = true
      try {
        const result = await this.$store.dispatch('login', this.userData)
        this.loading = false

        if (!result.success) {
          throw result.errorMessage
        }
      } catch (e) {
        this.loading = false
        return (this.message = e || this.$t('processes.login.autorizationError'))
      }
    },
    GetRecoveryPasswordUrl () {
      console.log('функционал recovery password не реализован')
    }
  },
  created () {
    this.$store.dispatch('logout')
  },
  render () {
    return this.$scopedSlots.default({
      userData: this.userData,
      message: this.message,
      needEnterTempPassword: this.needEnterTempPassword,
      loading: this.loading,
      params: {
        loginAttrs: {
          value: this.userData.login,
          label: this.$t('processes.login.loginLabel'),
          placeholder: this.$t('processes.login.inputLogin'),
          title: this.$t('processes.login.fieldForInputLogin'),
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
          label: this.$t('processes.login.password'),
          placeholder: this.$t('processes.login.inputPassword'),
          title: this.$t('processes.login.fieldForInputPassword'),
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
          label: this.$t('processes.login.remember'),
          title: ''
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
