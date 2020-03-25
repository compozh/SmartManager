import { mapGetters } from 'vuex'

export const folders = {
  computed: {
    ...mapGetters([
      'allFolders',
      'taskFolders',
      'caseFolders',
      'filters'
    ]),
    folderId () {
      return this.$route.params.folderId
    }
  },
  methods: {
    getFolders () {
      this.$store.dispatch('getFolders', 'loading')
    }
  }
}

export const tasks = {
  computed: {
    tasks () {
      return this.$store.getters.tasks
    }
  },
  methods: {
    async getTasks (folderId) {
      await this.$store.dispatch('getTasks', { folderId })
    }
  }
}

export const cases = {
  computed: {
    cases () {
      return this.$store.state.sm.cases
    }
  },
  methods: {
    async getCases () {
      if (this.cases.length === 0) {
        await this.$store.dispatch('getCases', false)
      }
    }
  }
}
