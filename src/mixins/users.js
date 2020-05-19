import { mapGetters } from 'vuex'

export const userInfo = {
  computed: {
    ...mapGetters([
      'userLogin',
      'userName',
      'userPhoto',
      'delegatedRights'
    ])
  }
}

export const userMethods = {
  methods: {
    async loginMethod () {
      const payload = {
        login: this.login,
        password: this.password,
        rememberMe: this.checkbox_remember_me
      }
      await this.$store.dispatch('login', payload)
    },
    async logout () {
      await this.$store.dispatch('logout')
    },
    async applyDelegatedRights (userId) {
      await this.$store.dispatch('applyDelegatedRights', userId)
    },
    async setUserData () {
      await this.$store.dispatch('setUserData')
    }
  }
}

export const users = {
  data: () => ({
    userListLoading: false
  }),
  computed: {
    users () {
      return this.$store.state.app.users || []
    }
  },
  created () {
    this.getUsers()
  },
  methods: {
    async getUsers () {
      this.userListLoading = true
      if (!this.users.length) {
        await this.$store.dispatch('getUsers')
      }
      this.userListLoading = false
    }
  }
}
