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
      return this.$route.params.routeToBack
    },
    needEnterTempPassword() {
      // Не реализовано
      return false
    }
  },
  methods: {
    async login() {
      if (!this.userData.login) {
        return (this.message = this.$t('authentication.emptyLogin'))
      }
      if (!this.userData.password) {
        return (this.message = this.$t('authentication.emptyPassword'))
      }
      this.loading = true
      try {
        const result = await this.$store.dispatch('auth/login', this.userData)
        this.loading = false
        if (result.success) {
          await this.$router.replace({ path: this.routeToBack })
        }
      } catch (e) {
        this.loading = false
        return (this.message = e || 'Ошибка авторизации')
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
          label: 'Логин',
          placeholder: 'Введите логин...',
          title: 'Поле для ввода логина',
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
          label: 'Пароль',
          placeholder: 'Введите пароль...',
          title: 'Поле для ввода пароля',
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
          label: 'Оставаться в системе',
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
