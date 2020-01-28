export default {
  name: 'userPanelRl',
  computed: {
    userData() {
      return this.$store.state.skd.user || {}
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('skd/logout')
    }
  },
  render() {
    return this.$scopedSlots.default({
      user: {
        id: this.userData.id,
        name: this.userData.userName,
        login: this.userData.login,
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
