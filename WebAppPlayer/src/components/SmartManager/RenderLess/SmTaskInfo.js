export default {
  name: 'smTaskInfoRl',
  props: ['taskinfo'],

  data: () => ({
    menu: {
      tabs: ['Задачи', 'Обсуждения', 'Связанные документы', 'История'],
      activeTab: null
    }
  }),
  computed: {
    taskDetail() {
      const smTasksInfo = this.$store.getters.getAppData('SMTASKINFO')
      if (smTasksInfo) {
        return smTasksInfo.data.smtasks.tasksGetInfo
      }
      return {}
    }
  },
  render() {
    return this.$scopedSlots.default({
      menu: this.menu,
      task: this.taskDetail,
      props: {}
    })
  }
}
