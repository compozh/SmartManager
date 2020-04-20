export const sideBar = {
  computed: {
    sideBarOpen: {
      get () {
        return this.$store.state.app.sideBarOpen
      },
      set (val) {
        this.$store.commit('TOGGLE_SIDEBAR_OPEN', val)
      }
    },
    expandOnHover: {
      get () {
        return this.$store.state.app.expandOnHover
      },
      set (val) {
        this.$store.commit('EXPAND_ON_HOVER', val)
      }
    },
    miniVariant: {
      get () {
        return this.$store.state.app.miniVariant
      },
      set (val) {
        this.$store.commit('MINI_VARIANT', val)
      }
    }
  },
  methods: {
    toggleSideBar () {
      this.sideBarOpen = !this.sideBarOpen
      this.expandOnHover = !this.expandOnHover
      this.miniVariant = !this.miniVariant
    }
  }
}
