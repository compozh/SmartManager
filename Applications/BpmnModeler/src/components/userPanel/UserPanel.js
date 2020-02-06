export default {
  name: 'userPanelRl',
  computed: {
    userData() {
      return this.$store.state.auth.user || {};
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('auth/logout');
      if (this.$router.currentRoute.name !== 'login') {
        this.$router.push({ path: 'login', query: {to: this.$router.currentRoute.path } });
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
    });
  }
};
