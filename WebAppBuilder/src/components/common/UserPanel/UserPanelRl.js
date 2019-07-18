import {mapGetters} from "vuex"

export default {
  name: 'userPanelRl',
  methods: {
    changePassword() {
      console.log('Запрос изменения пароля')
    },
    setDelegation() {
      this.$store.dispatch('setDelegationRights', {userId: '*U20810', dateFrom: null, dateTo: null})
    },
    useDelegatedRights(userId) {
      this.$store.dispatch('applyDelegatedRights', userId)
    },
    logOut() {
      this.$store.dispatch("LogOut");
      this.$router.push({name: 'login'});
    }
  },
  computed: {
    ...mapGetters({
      login: 'getCurrentUserLoginData',
      rights: 'getCurrentUserRights',
      photo: 'getCurrentUserPhoto'
    })
  },
  render() {
    return this.$scopedSlots.default({
      user: {
        name: this.login ? this.login.UserName : '',
        login: this.login ? this.login.UserLogin : '',
        id: this.login ? this.login.UserId : '',
        rights: this.rights || {},
        photo: this.photo || '',
      },
      params: {
        changePassword: this.changePassword,
        delegatedRightsBtnAttr: {},
        delegatedRightsBtnAEvents: {
          click: e => this.useDelegatedRights(e.target.id)
        },
        setDelegationBtnAttr: {},
        setDelegationBtnEvents: {
          click: () => this.setDelegation()
        },
        logOutBtnAttr: {},
        logOutBtnAEvents: {
          click: () => this.logOut()
        }
      }
    })
  }
}