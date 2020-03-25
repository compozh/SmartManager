import { mapGetters } from 'vuex'

export const zones = {
  computed: {
    zones () {
      return [
        {
          id: 0,
          title: this.$t('sideBar.tasksBtn'),
          folders: [...this.taskFolders, ...this.filters],
          icon: 'tasks'
        },
        {
          id: 1,
          title: this.$t('sideBar.casesBtn'),
          folders: this.caseFolders,
          icon: 'suitcase'
        },
        {
          id: 2,
          title: this.$t('sideBar.forceBpm'),
          folders: [],
          icon: 'project-diagram'
        }
      ]
    },
    activeZone: {
      get () {
        return this.$store.state.app.activeZone || {}
      }
    },
    activeZoneId: {
      get () {
        return this.activeZone.id || 0
      },
      set (zone) {
        this.$store.commit('SET_ACTIVE_ZONE', this.zones[zone])
      }
    }
  }
}

export const folders = {
  computed: {
    ...mapGetters([
      'allFolders',
      'taskFolders',
      'caseFolders',
      'filters',
      'activeFolder'
    ]),
    activeFolderId: {
      get () {
        return this.$route.params.folderId || 'active'
      },
      set (folderId) {
        this.$store.commit('SET_ACTIVE_FOLDER', folderId)
      }
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
