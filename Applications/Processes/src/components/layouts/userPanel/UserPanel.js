export default {
  name: 'userPanelRl',
  computed: {
    userData () {
      return this.$store.state.user || {}
    }
  },
  methods: {
    logout () {
      this.$store.dispatch('logout')
    }
  },
  render () {
    return this.$scopedSlots.default({
      user: {
        id: this.userData.id,
        name: this.userData.userName || this.userData.login,
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
