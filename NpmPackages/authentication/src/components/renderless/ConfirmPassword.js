export default {
  name: 'confirm',
  data: () => ({
    code: ''
  }),
  computed: {
    routeToBack() {
      return this.$route.params.routeToBack
    },
  },
  methods: {
    SendConfirmCode() {
      console.log('SendConfirm')
      this.$authentication.ConfirmPassword(this.code).then(res => {
        if (res) {
          this.$router.replace({path: this.routeToBack})
        }
      })
    }
  },
  render() {
    return this.$scopedSlots.default({
      confirm: {
        confirmAttrs: {
          label: 'Введите временный код',
          value: this.code,
        },
        SetCode: {
          input: value => (this.code = value),
          keydown: e => {
            if (e.key === 'Enter') {
              this.code = e.target.value
              e.preventDefault()
              this.SendConfirmCode()
            }
          }
        },
        SendConfirmCode: {
          click: () => this.SendConfirmCode()
        }
      }
    })
  }
}
  