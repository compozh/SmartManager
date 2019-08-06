// Renderless component for SmartManager \ components \ Views \ Tabs \ Details

export default {
  name: 'sm-tasks-item-rl',
  computed: {
    task() {
      return this.$store.state.sm.taskInfo
    }
  },
  methods: {
    goToTaskInfo(taskId) {
      this.$store.dispatch('sm/getTaskInfo', {
        taskId,
        loader: 'setCircularLoader'
      })
      this.$router.push({name: 'SMARTMANAGERTASKDETAIL', params: {taskId}})
    }
  },
  render() {
    return this.$scopedSlots.default({
      task: this.task,
      taskLink: this.goToTaskInfo,
      params: {}
    })
  }
}
