export const sideBar = {
  computed: {
    sideBarLocked: {
      get () {
        return this.$store.state.app.sideBarLocked
      },
      set (val) {
        this.$store.commit('SIDE_BAR_LOCKED', val)
      }
    },
    expandOnHover: {
      get () {
        return this.$store.state.app.expandOnHover
      },
      set (val) {
        if (!this.sideBarLocked) {
          this.$store.commit('EXPAND_ON_HOVER', val)
        }
      }
    },
    miniVariant: {
      get () {
        return this.$store.state.app.miniVariant
      },
      set (val) {
        if (!this.sideBarLocked) {
          this.$store.commit('MINI_VARIANT', val)
        }
      }
    }
  },
  methods: {
    toggleSideBar () {
      this.miniVariant = !this.miniVariant
      this.expandOnHover = !this.expandOnHover
    }
  }
}
