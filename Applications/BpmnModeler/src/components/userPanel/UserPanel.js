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
      if (this.$router.currentRoute.name !== 'BPMNLOGIN') {
        this.$router.push({ path: '/bpmnmodeler/login' })
      }
    }
  },
  render() {
    return this.$scopedSlots.default({
      user: {
        id: this.userData.id,
        name: this.userData.userName,
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
