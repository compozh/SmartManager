export default {
  name: 'loginRl',
  data: () => ({
    userData: {
      login: '',
      password: '',
      remember: false
    },
    message: ''
  }),
  computed: {
    routeToBack() {
      return this.$route.params.routeToBack
    }
  },
  methods: {
    login() {
      if (!this.userData.login) {
        return this.message = this.$t('emptyLogin')
      }
      if (!this.userData.password) {
        return this.message = this.$t('emptyPassword')
      }

      this.$store.dispatch("Login", this.userData)
        .then(
          result => result ? this.$router.replace({path: this.routeToBack}) : ''
        )
        .catch(() => this.message = 'Ошибка авторизации')
    }
  },
  render() {
    return this.$scopedSlots.default({
      userData: this.userData,
      message: this.message,
      params: {
        loginAttrs: {
          value: this.userData.login,
          label: 'Логин',
          placeholder: 'Введите логин...',
          title: 'Поле для ввода логина',
          required: true
        },
        loginEvents: {
          input: value => this.userData.login = value,
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
          input: value => this.userData.password = value,
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
          title: '',
        },
        rememberEvents: {
          change: () => this.userData.remember = !this.userData.remember
        },
        buttonAttrs: {
          value: this.userData.remember
        },
        buttonEvents: {
          click: () => this.login()
        },
        messageAttrs: {
          style: [
            {display: this.message ? 'block' : 'none'}
          ]
        }
      }
    })
  }
}