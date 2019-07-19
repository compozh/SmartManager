import {mapGetters} from "vuex"

export default {
  name: 'userPanelRl',
  methods: {
    changePassword() {
      console.log('Запрос изменения пароля')
    },
    applyDelegatedRights(userId) {
      this.$store.dispatch('applyDelegatedRights', userId)
    },
    logOut() {
      this.$store.dispatch("LogOut");
      this.$router.push({name: 'SMARTMANAGERLOGIN'})
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
        delegatedRights: {
          click: e => this.applyDelegatedRights(e.target.id)
        },
        setDelegation: {
          click: () => this.setDelegation()
        },
        logOut: {
          click: () => this.logOut()
        }
      }
    })
  }
}