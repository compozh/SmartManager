export default {
  name: 'userPanelRl',
  computed: {
    userData() {
      return this.$store.state.auth.user || {}
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('auth/logout')
      this.$store.commit('mes/setWorkCenter', {})
      this.$store.commit('mes/setInitialWorkCenter', false)
      this.$store.commit('mes/resetState')
    }
  },
  render() {
    return this.$scopedSlots.default({
      user: {
        id: this.userData.id,
        name: this.userData.userName || this.userData.login ,
        photo: this.userData.userPhoto,
        rights: this.userData.delegatedRights
      },
      params: {
        logOut: {
          click: () => this.logout()
        }
      }
    })
  }
}
