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
      this.$store.dispatch('sm/getTaskInfo', taskId)
    }
  },
  computed: {
    task() {
      return this.$store.getters['sm/taskInfo']
    },
    getTabs() {
      if (this.task) {
        return this.tabs
      }
    }
  },
  render() {
    return this.$scopedSlots.default({
      activeTab: this.activeTab,
      tabs: this.getTabs,
      params: {
        hasOrig: this.task ? this.task.originals.length : 0,
        hasComm: this.task ? this.task.comments.length : 0
      }
    })
  }
}