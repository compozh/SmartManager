import { mapGetters } from 'vuex'

export const common = {
  computed: {
    type () {
      // TODO: check for case from case object or route
      if (this.task.__typename === 'Case') {
        return 'CASE'
      }
      if (this.task.keyValue) {
        return 'DOCUMENT'
      }
      return 'TASK'
    },
    params () {
      return {
        id: this.taskId || this.caseId,
        type: this.type,
        arso: this.task.arso,
        keyValue: this.task.keyValue,
        kidCopy: this.task.kidCopy
      }
    }
  }
}

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
    // CONDITIONS FOR BUTTONS
    internalTaskInWork () {
      return this.internalTask && this.taskInWork
    },
    taskCompleted () {
      return this.taskType === '' && this.task.status === '+'
    },
    agreeTaskInWork () {
      return this.taskType === 'AGREE' && this.taskInWork
    },
    workFlowTaskInWork () {
      return this.taskType === 'WORKFLOW' && this.taskInWork
    },
    externalTaskCamunda () {
      if (!this.task.externalParams) {
        return
      }
      const externalParams = JSON.parse(this.task.externalParams)
      return this.taskType === 'EXTERNAL' &&
        externalParams.EXTERNALSOURCE === 'C'
    },
    userIsPerformer () {
      return this.userId === this.task.performerId
    },
    allowedCaseEdit () {
      return this.$route.name === 'case-view' &&
        this.caseStatus === '' &&
        this.userId === this.caseItem.userAdd
    },
    allowedTaskEdit () {
      return this.$route.name === 'task-details' &&
        this.internalTaskInWork &&
        this.userId === this.task.declarerId
    }
  },
  methods: {
    async getTasks (folderId) {
      await this.$store.dispatch('getTasks', folderId)
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
    },
    caseId () {
      return this.case.id || +this.$route.params.caseId
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
  data: () => ({
    attachmentsList: [],
    uploadErrors: [],
    attachmentType: null
  }),
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
    },
    attachmentTypes () {
      return this.$store.state.attachments.attachmentTypes || []
    },
    fileSize () {
      return size => {
        switch (true) {
          case size < 1024: return `${size} Byte`
          case size < 1024000: return `${(size / 1024).toFixed(1)} Kb`
          default: return `${(size / 1024 / 1024).toFixed(2)} Mb`
        }
      }
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
    },
    async getAttachmentTypes () {
      await this.$store.dispatch('getAttachmentTypes', this.params)
    },
    getAttachments (attachments) {
      this.attachmentsList = attachments
    },
    async addAttachments () {
      if (this.attachmentTypes.length === 1) {
        this.attachmentType = this.attachmentTypes[0].CODE
      }
      this.attachments.forEach(a => { a.type = this.attachmentType })
      // Returns results list
      const results = await this.$store.dispatch('addAttachments', {
        attachments: this.attachments,
        params: this.params
      })
      results.forEach(result => {
        if (!result.success) {
          this.uploadErrors.push({
            fileName: result.name,
            message: result.errorMessage
          })
        }
      })
      this.attachments.length = 0
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
