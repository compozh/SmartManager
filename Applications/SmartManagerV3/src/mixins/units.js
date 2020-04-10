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
        return this.$route.params.folderId ||
          this.$store.state.folders.activeFolderId ||
          'active'
      },
      set (folderId) {
        this.$store.commit('SET_ACTIVE_FOLDER', { folderId, source: 'units' })
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
    },
    task () {
      const id = +this.$route.params.taskId
      const task = this.$store.state.tasks.taskDetails[id]
      return task || {}
    },
    taskId () {
      return this.task.id || +this.$route.params.taskId
    },
    type () {
      if (this.task.__typename === 'Case') {
        return 'CASE'
      }
      if (this.task.keyValue) {
        return 'DOCUMENT'
      }
      return 'TASK'
    }
  },
  methods: {
    async getTasks (folderId) {
      await this.$store.dispatch('getTasks', {
        folderId, preLoader: true
      })
    },
    async getTask () {
      const taskId = +this.$route.params.taskId
      if (!this.task.id) {
        try {
          await this.$store.dispatch('getTaskDetails', {
            taskId, preLoader: true
          })
        } catch (e) {
          console.log(e.message)
        }
      }
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

export const attachments = {
  computed: {
    attachments () {
      return this.task.originals && this.task.originals.length
        ? this.task.originals
        : []
    },
    activeAttachment () {
      return this.$store.state.attachments.activeAttachment ||
        this.attachments[0] || {}
    },
    attachmentDetails () {
      return this.$store.state.attachments.attachmentDetails || {}
    }
  },
  methods: {
    setActiveAttachment (attachment) {
      this.$store.commit('SET_ACTIVE_ATTACHMENT', attachment)
    },
    getAttachmentDetails () {
      const { id: fileId, fileExt } = this.activeAttachment
      if (fileId && fileExt) {
        const id = +this.$route.params.taskId || +this.$route.params.caseId
        this.$store.dispatch('getFileDetails', { fileId, fileExt, id })
      }
    },
    resetAttachmentData () {
      this.$store.commit('SET_ACTIVE_ATTACHMENT', null)
      this.$store.commit('SET_ATTACHMENT_DETAILS', {})
    }
  }
}

export const processes = {
  computed: {
    processes () {
      return this.$store.state.processes.processes
    }
  },
  methods: {
    async getProcesses () {
      if (this.processes.length === 0) {
        await this.$store.dispatch('getProcesses', false)
      }
    }
  }
}
