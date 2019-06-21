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
      value: null
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
      console.log('', this.$store.getters['sm/taskInfo'])
      return this.$store.getters['sm/taskInfo']
    },
    getTabs() {
      const task = this.taskDetail
      if (task) {
        return this.tabs.filter(i => {
          // вкладка с комментариями отображается всегда
          if (i.value === 'tasks' || i.value === 'comments') {
            return true
          }
          // остальные вкладки кроме "согласования" отображаются если есть данные
          if (task[i.value]
            && task[i.value].length
            && task[i.value] !== 'agreement') {
            return true
          }
          // вкладка "согласования" отображается если есть хоть один согласующий коментарий
          if (i.value === 'agreement') {
            return task.comments.some(i => i === 'isAgree' && i === '+')
          }
        })
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