export const sideBar = {
  computed: {
    sideBarOpen: {
      get () {
        return this.$store.state.app.sideBarOpen
      },
      set () {
        this.$store.commit('TOGGLE_SIDEBAR_OPEN')
      }
    }
  }
}
