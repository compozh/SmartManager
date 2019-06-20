export default {
  name: 'smTasksItemRl',
  methods: {
    goToTaskInfo(taskId) {
      this.$router.push({name: 'SMARTMANAGERTASKDETAIL', params: {taskId}})
    }
  },
  render() {
    return this.$scopedSlots.default({
      taskLink: this.goToTaskInfo
    })
  }
}