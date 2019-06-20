export default {
  name: 'smTaskInfoRl',
  data: () => ({
    tabs: [
      {name: 'Задачи', value: 'tasks', component: 'sm-task-tab-tasks'},
      {name: 'Документы', value: 'originals', component: 'sm-task-tab-docs'},
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
      return this.$store.getters['sm/taskInfo']
    },
    getNotEmptyTabs() {
      const taskObj = this.taskDetail
      if (taskObj) {
        return this.tabs.filter(i => {
          // вкладка с комментариями отображается всегда
          if (i.value === 'comments') {
            return true
          }
          // остальные вкладки кроме "согласования" отображаются если есть данные
          if (taskObj[i.value]
            && taskObj[i.value].length
            && taskObj[i.value] !== 'agreement') {
            return true
          }
          // вкладка "согласования" отображается если есть хоть один согласующий коментарий
          if (i.value === 'agreement') {
            return taskObj.comments.some(i => i === 'isAgree' && i === '+')
          }
        })
      }
    }
  },
  render() {
    return this.$scopedSlots.default({
      activeTab: this.activeTab,
      tabs: this.getNotEmptyTabs,
      task: this.taskDetail,
      props: {}
    })
  }
}