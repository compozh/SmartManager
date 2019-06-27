export default {
  name: 'smTaskInfoRl',
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
    const taskInfo = this.taskDetail
    if (taskInfo === null || taskInfo.id !== taskId) {
      this.$store.dispatch('sm/getTaskInfo', taskId)
    }
  },
  computed: {
    taskDetail() {
      return this.$store.getters['sm/taskInfo']
    },
    getTabs() {
      const task = this.taskDetail
      if (task) {
        return this.tabs
      }
    }
  },
  render() {
    return this.$scopedSlots.default({
      activeTab: this.activeTab,
      tabs: this.getTabs,
      taskDetail: this.taskDetail,
      props: {}
    })
  }
}