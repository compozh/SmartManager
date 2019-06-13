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
  methods: {
    changePassword() {
      console.log('Запрос изменения пароля')
    },
    setDelegation() {
      console.log('Делегировать права')
    },
    useDelegatedRights(name) {
      console.log('Использовать права для', name)
    },
    logOut() {
      this.$store.dispatch("LogOut");
      this.$router.push({name: 'login'});
    }
  },
  render() {
    return this.$scopedSlots.default({
      user: {
        name: this.$store.getters.getCurrentUserLoginData.UserName,
        login: this.$store.getters.getCurrentUserLoginData.UserLogin,
        id: this.$store.getters.getCurrentUserLoginData.UserId,
        rights: this.$store.getters.getCurrentUserRights,
        photo: this.$store.getters.getCurrentUserPhoto
      },
      params: {
        changePassword: this.changePassword,
        delegatedRightsBtnAttr: {

        },
        delegatedRightsBtnAEvents: {
          click: e => this.useDelegatedRights(e.target.innerHTML)
        },
        setDelegationBtnAttr: {

        },
        setDelegationBtnEvents: {
          click: () => this.setDelegation()
        },
        logOutBtnAttr: {

        },
        logOutBtnAEvents: {
          click: () => this.logOut()
        }
      }
    })
  }
}