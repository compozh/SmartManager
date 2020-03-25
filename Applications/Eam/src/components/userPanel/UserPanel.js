export default {
  name: 'userPanelRl',
  computed: {
    userData() {
      return this.$store.getters['eam/auth/user'] || {}
    },
    notificationsEnabled() {
      return this.$store.getters['eam/notifications']
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('eam/auth/logout')
      if (this.$router.currentRoute.name !== 'EAMLOGIN') {
        this.$router.push({ name: 'EAMLOGIN' })
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
      notifications: {
        enabled: this.notificationsEnabled,
        toggle: () => this.$store.dispatch('eam/toggleNotifications')
      },

      params: {
        logOut: {
          click: () => this.logout()
        }
      }
    })
  }
}
