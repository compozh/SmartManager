export default {
  name: 'userPanelRl',
  data: () => ({
    menu: {
      fav: true,
      show: false,
      message: false,
      hints: true,
    },
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
      menu: this.menu,
      userData: this.getUserData,
      params: {
        changePassword: this.changePassword,
        delegatRigthBtnAttr: {
          items: ['user1', 'user2'],
          style: this.menuBtnStyle
        },
        delegatRigthBtnAEvents: {

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