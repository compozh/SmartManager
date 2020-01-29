export default {
  name: 'ConfirmTempPassword',
  data: () => ({
    code: ''
  }),
  computed: {
    routeToBack() {
      return this.$route.query.to || '/'
    },
  },
  methods: {
    SendTempPassword() {
      this.$authentication.СonfirmTempPassword(this.code).then(res => {
        if (res) {
          this.$router.replace({path: this.routeToBack})
        }
      })
    }
  },
  render() {
    return this.$scopedSlots.default({
      properties: {
        buttonSendName: this.$t('authentication.send'),
        tempPasswordFieldAttrs: {
          label: this.$t('authentication.enterTempCode'),
          placeholder: this.$t('authentication.enterTempCodeDot'),
          title: this.$t('authentication.enterTempCodeTitle'),
          value: this.code,
        },
        tempPasswordFieldEvents: {
          input: value => (this.code = value),
          keydown: e => {
            if (e.key === 'Enter') {
              this.code = e.target.value
              e.preventDefault()
              this.SendTempPassword()
            }
          }
        },
        sendTempPasswordFieldEvents: {
          click: () => this.SendTempPassword()
        }
      }
    })
  }
}
  