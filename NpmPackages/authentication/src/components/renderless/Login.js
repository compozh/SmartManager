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
    needConfirmPassword() {
      return this.$store.state.authentication.needEnterTempPassword
    }
  },
  methods: {
    login() {
      if (!this.userData.login) {
        return (this.message = this.$t('authentication.emptyLogin'))
      }
      if (!this.userData.password) {
        return (this.message = this.$t('authentication.emptyPassword'))
      }
      this.loading = true
      this.$authentication.logIn(this.userData.login, this.userData.password, this.userData.rememberMe).then(res => {
        this.loading = false
        if (res) {
          this.$store.commit('authentication/setCurrentUser', this.$authentication.currentUser)
          this.$router.replace({ path: this.routeToBack })
        }
      }).catch((e) => {
        this.loading = false
        return (this.message = e || 'Ошибка авторизации')
      })
    },
    recover() {
      this.$authentication.Recover().then(res => {
        if (res.ALLOWED) {
          window.open(res.LINK, '_blank')
        }
      })
    }
  },
  created() {
    this.$store.commit('authentication/setCurrentUser', this.$authentication.currentUser)
  },
  render() {
    return this.$scopedSlots.default({
      userData: this.userData,
      message: this.message,
      needConfirmPassword: this.needConfirmPassword,
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
        buttonEventRecover: {
          click: () => this.recover()
        },
        messageAttrs: {
          style: [{ display: this.message ? 'block' : 'none' }]
        }
      }
    })
  }
}
