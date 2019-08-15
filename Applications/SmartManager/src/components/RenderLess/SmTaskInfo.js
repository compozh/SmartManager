export default {
  name: 'sm-task-info-rl',
  data: () => ({
    tabs: [
      {name: 'Детально', value: 'tasks', component: 'sm-task-tab-tasks'},
      {name: 'Вложения', value: 'originals', component: 'sm-task-tab-docs'},
      {name: 'Обсуждения', value: 'comments', component: 'sm-task-tab-comments'},
      {name: 'Согласования', value: 'agreement', component: 'sm-task-tab-agree'}
    ],
    activeTab: {
      value: 0
    }
  }),
  created() {
    const taskId = +this.$route.params.taskId
    const task = this.task
    if (task === null || task.id !== taskId) {
      this.$store.dispatch('sm/getTaskInfo', {
        taskId,
        loader: 'setCircularLoader'
      })
    }
  },
  computed: {
    task() {
      return this.$store.state.sm.taskInfo
    },
    getTabs() {
      if (this.task) {
        return this.hiddenLgAndUp
          ? this.tabs.filter(tab => tab.value !== 'originals')
          : this.tabs
      }
    },
    hiddenLgAndUp() {
      return this.$vuetify.breakpoint.lgAndUp
    },
  },
  methods: {
    changeTaskStage(moveMode, comment) {
      this.$store.dispatch('sm/changeTaskStage', {
        id: this.task.id,
        arso: this.task.arso,
        keyValue: this.task.keyValue,
        kidCopy: this.task.kidCopy,
        moveMode,
        comment,
        processParams: null
      })
    },
    changeTaskStatus(status) {
      this.$store.dispatch('sm/changeTaskStatus', {
        id: this.task.id,
        status: status,
        comment: ''
      })
    }
  },
  render() {
    return this.$scopedSlots.default({
      activeTab: this.activeTab,
      tabs: this.getTabs,
      task: this.task ? this.task : {},
      params: {
        hiddenLgAndUp: this.hiddenLgAndUp,
      },
      events: {
        changeStage: this.changeTaskStage,
        changeStatus: this.changeTaskStatus
      }
    })
  }
}
