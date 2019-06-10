export default {
  name: 'userPanelRl',
  data: () => ({
    menuBtnStyle: [
      { 'textTransform': 'none' },
      { 'font-weight': 300 },
      { color: 'rgb(102, 102, 102)' },
      { 'border-color': '#c6c6c6' }
    ]
  }),
  computed: {
    getUserData() {
      return this.$store.state.userData
    },
    getDelegatedRights() {
      return this.$store.state.userData.DelegatedRights
    }
  },
  methods: {
    changePassword() {
      console.log('Запрос изменения пароля')
    },
    logOut() {
      this.$store.dispatch("LogOut");
      this.$router.push({name: 'login'});
    }
  },
  render() {
    return this.$scopedSlots.default({
      userData: this.getUserData,
      params: {
        changePassword: this.changePassword,
        delegatedRightsBtnAttr: {
          style: this.menuBtnStyle
        },
        delegatedRightsBtnAEvents: {

        },
        logOutBtnAttr: {
          style: this.menuBtnStyle
        },
        logOutBtnAEvents: {
          click: () => this.logOut()
        }
      }
    })
  }
}