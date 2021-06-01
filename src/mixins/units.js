import { mapGetters } from 'vuex'

export const common = {
  computed: {
    type () {
      // TODO: check for case from case object or route
      if (this.$route.params.caseId) {
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
          group: 'tasks',
          link: '/tasks',
          icon: 'tasks'
        },
        {
          id: 1,
          title: this.$t('sideBar.casesBtn'),
          folders: this.caseFolders,
          group: 'cases',
          link: '/cases',
          icon: 'suitcase'
        },
        {
          id: 2,
          title: this.$t('sideBar.processes'),
          folders: [],
          group: 'processes',
          link: '/processes',
          icon: 'project-diagram'
        }
      ]
    },
    routeZone () {
      return this.zones.find(zone => zone.group === this.$route.meta.zone) || {}
    },
    activeZone () {
      return this.$store.state.app.activeZone || {}
    },
    activeZoneId: {
      get () {
        return this.activeZone.id || 0
      },
      set (zone) {
        this.$store.commit('SET_ACTIVE_ZONE', this.zones[zone])
      }
    },
    customLinks () {
      const links = [...(this.$store.state.app.applicationParams.CUSTOMLINKS || [])]
      return links.sort((a, b) => a.Order - b.Order)
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
        const activeZone = this.$store.state.app.activeZone
        return this.$store.state.folders.activeFolderId ||
          (activeZone.group === 'cases' ? 'all' : 'active')
      },
      set (folderId) {
        /* TODO: fix define activeFolderId value when folder page update
            in TheSideBar -> v-list-item-group v-model="activeFolderId" */
        this.$store.commit('SET_ACTIVE_FOLDER', { folderId })
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

    taskType () {
      return this.task.taskType
    },

    taskInProgress () {
      return this.task.status === '' || this.task.status === '*'
    },

    taskIsDone () {
      return this.taskType === '' &&
        (this.task.status === '+' || this.task.status === '#')
    },

    taskAtApproval () {
      return this.task.status === '#'
    },

    internalTask () {
      return this.taskType === '' ||
        this.taskType === 'AGREE' ||
        this.taskType === 'WORKFLOW'
    },

    // CONDITIONS FOR BUTTONS
    internalTaskInWork () {
      return this.internalTask && this.taskInProgress
    },

    agreeTaskInWork () {
      return this.taskType === 'AGREE' && this.taskInProgress
    },

    workFlowTaskInWork () {
      return this.taskType === 'WORKFLOW' && this.taskInProgress
    },

    externalTaskCamunda () {
      return this.taskType === 'EXTERNAL' &&
        this.externalParams.EXTERNALSOURCE === 'C'
    },

    externalParams () {
      return this.task.externalParams
        ? JSON.parse(this.task.externalParams)
        : {}
    },

    formDefinition () {
      return {
        components: this.form.COMPONENTS,
        submission: this.form.SUBMISSION,
        display: this.form.DISPLAY,
        settings: this.form.SETTINGS,
        properties: this.form.PROPERTIES,
        isSystem: this.form.ISSYSTEM,
        customStyles: this.form.customStyles,
        name: this.form.NAME
      }
    },

    escalations () {
      return this.externalParams?.ESCALATIONBOUNDARYEVENTS
    },

    objectId () {
      if (this.businessObject) {
        return this.businessObject.BusinessObjectKey
      } else {
        return +this.$route.params.taskId || +this.$route.params.caseId
      }
    },

    businessObjects () {
      return this.externalParams.BUSINESSOBJECTKEYS || []
    },

    businessObjectParams () {
      return businessObject => {
        let businessObjectParams = {}
        if (businessObject) {
          businessObjectParams = {
            BusinessObjectDefinitionCode: businessObject.BusinessObjectDefinitionCode || '',
            BusinessObjectKey: businessObject.BusinessObjectKey || '',
            BusinessObjectKeyType: businessObject.BusinessObjectKeyType || 0
          }
        }
        return businessObjectParams
      }
    },

    references () {
      return businessObject => {
        return businessObject && businessObject.References
          ? businessObject.References
          : []
      }
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
    },

    taskDialog: {
      get () {
        return this.$store.state.tasks.taskDialog
      },
      set (val) {
        this.showTaskDialog(val)
      }
    },

    taskEditable () {
      return this.$store.state.tasks.taskEditable
    },

    taskChanged () {
      return this.$store.state.tasks.taskChanged
    }
  },
  methods: {
    async getTasks (folderId) {
      await this.$store.dispatch('getTasks', folderId)
    },
    async getTask () {
      const result = await this.$store.dispatch('getTaskDetails', {
        taskId: this.taskId
      })
      result.success || await this.$router.push('/error404')
      this.showTaskDialog(true)
    },
    showTaskDialog (toShow = true) {
      this.$store.commit('SHOW_TASK_DIALOG', toShow)
    },
    setTaskEditable (isEditable = true) {
      this.$store.commit('SET_TASK_EDITABLE', isEditable)
    },
    setTaskChanged (isChanged = true) {
      this.$store.commit('SET_TASK_CHANGED', isChanged)
    }
  }
}

export const cases = {
  computed: {
    cases () {
      const cases = this.$store.getters.cases
      if (this.$route.params.folderId === 'all') {
        return cases
      }
      return cases.filter(i => i.folderId === +this.$route.params.folderId)
    },
    caseItem () {
      const id = +this.$route.params.caseId
      const caseItem = this.$store.state.cases.caseDetails[id]
      return caseItem || {}
    },
    caseId () {
      return this.caseItem.id || +this.$route.params.caseId
    },
    caseTasks () {
      return this.caseItem.tasks
        ? this.caseItem.tasks
        : []
    },
    caseDialog: {
      get () {
        return this.$store.state.cases.caseDialog
      },
      set (val) {
        this.showCaseDialog(val)
      }
    },
    caseEditable () {
      return this.$store.state.cases.caseEditable
    },
    caseChanged () {
      return this.$store.state.cases.caseChanged
    }
  },
  methods: {
    async getCases () {
      await this.$store.dispatch('getCases')
    },
    async getCase () {
      const result = await this.$store.dispatch('getCaseDetails', {
        caseId: this.caseId
      })
      result.success || await this.$router.push('/error404')
      this.showCaseDialog(true)
    },
    showCaseDialog (toShow = true) {
      this.$store.commit('SHOW_CASE_DIALOG', toShow)
    },
    setCaseEditable (isEditable = true) {
      this.$store.commit('SET_CASE_EDITABLE', isEditable)
    },
    setCaseChanged (isChanged = true) {
      this.$store.commit('SET_CASE_CHANGED', isChanged)
    }
  }
}

export const attachments = {
  data: () => ({
    uploadErrors: [],
    attachmentType: '',
    loading: true // for viewers
  }),
  computed: {
    attachments () {
      return this.$store.state.attachments.attachments || []
    },
    activeAttachment () {
      return this.$store.state.attachments.activeAttachment || {}
    },
    currentVersion () {
      return this.$store.state.attachments.currentVersion || {}
    },
    attachmentTypes () {
      const types = this.$store.state.attachments.attachmentTypes
      const typeList = types && types[this.objectId] ? types[this.objectId] : []
      // Set simple attachments type to top of list
      return [...typeList].sort(a => a.CODE === '' ? -1 : 0)
    },
    currentType () {
      return this.$store.state.attachments.currentType || {}
    },
    fileExtensions () {
      let extensions = this.currentType.FILEEXTENSIONS
      if (extensions) {
        extensions = typeof extensions === 'string'
          ? [extensions]
          : [...extensions]
      } else {
        extensions = []
      }
      return extensions.map(extension => `.${extension.toLowerCase()}`).join(',')
    },
    fileSize () {
      return size => {
        switch (true) {
          case size < 1024: return `${size} Byte`
          case size < 1048576: return `${(size / 1024).toFixed(1)} Kb`
          default: return `${(size / 1024 / 1024).toFixed(2)} Mb`
        }
      }
    }
  },
  methods: {
    async setActiveAttachment (attachment, version) {
      this.resetAttachmentData()
      if (attachment) {
        if (!attachment.hasDetails) {
          await this.getAttachmentDetails(attachment)
        }
        this.$store.commit('SET_ACTIVE_ATTACHMENT', { attachment, version })
      }
    },

    async getAttachmentDetails (attachment) {
      let result = null
      const { id: fileId, fileExt, fileSize } = attachment || this.activeAttachment
      if (fileId && fileExt) {
        result = await this.$store.dispatch('getFileDetails', {
          fileId, fileExt, fileSize
        })
      }
      return result
    },
    async getAttachmentTypes (businessObject) {
      await this.$store.dispatch('getAttachmentTypes', {
        ...this.params,
        ...this.businessObjectParams(businessObject)
      })
    },

    async addAttachments (attachment, businessObject) {
      if (this.attachmentTypes.length === 1) {
        this.attachmentType = this.attachmentTypes[0].CODE
      }
      attachment.type = this.currentType.CODE
      // Returns results list
      const results = await this.$store.dispatch('addAttachments', {
        attachments: [attachment],
        params: {
          ...this.params,
          ...this.businessObjectParams(businessObject)
        }
      })
      results.forEach(result => {
        if (!result.success) {
          this.uploadErrors.push({
            fileName: result.name,
            message: result.errorMessage
          })
        }
      })
      const newAttachment = this.attachments.find(i => i.id === results[0].id)
      await this.setActiveAttachment(newAttachment)
    },

    async addVersion (attachment, filePath) {
      await this.$store.dispatch('addVersion', {
        fileId: attachment.id,
        fileExt: attachment.fileExt,
        fileSize: attachment.fileSize,
        filePath
      })
      await this.setActiveAttachment(attachment)
    },

    async setActiveVersion (attachmentId, version) {
      await this.$store.dispatch('setActiveVersion', { attachmentId, version })
    },

    async getPdfUrl () {
      return await this.$store.dispatch('getPdfUrl')
    },

    async deleteVersion (attachment, versionId) {
      const result = await this.$store.dispatch('deleteVersion', { attachment, versionId })
      // If the deleted version is current, will be shown the active version
      if (result.success && this.currentVersion.Id === versionId) {
        await this.setActiveAttachment(attachment)
      }
    },

    async attachmentDelete (attachment) {
      await this.$store.dispatch('attachmentDelete', {
        fileId: this.getActiveId(attachment),
        taskId: +this.$route.params.taskId,
        caseId: +this.$route.params.caseId
      })
      await this.setActiveAttachment(this.attachments[0])
    },

    getActiveId (attachment) {
    // Instead attachment ID need active version ID for accuracy
      if (attachment.versions) {
        const activeVersion = attachment.versions.find(i => i.IsActive)
        return activeVersion.Id
      }
      return attachment.id
    },

    resetAttachmentData () {
      this.$store.commit('SET_ACTIVE_ATTACHMENT', {
        attachment: {},
        version: {}
      })
    }
  }
}

export const processes = {
  computed: {
    processes () {
      return this.$store.state.processes?.processes || []
    },
    process () {
      return this.processes.find(process => {
        return process.procDefId === this.$route.params.processId
      })
    }
  },
  methods: {
    async getProcesses () {
      if (!this.processes.length) {
        await this.$store.dispatch('getProcesses', false)
      }
    }
  }
}
