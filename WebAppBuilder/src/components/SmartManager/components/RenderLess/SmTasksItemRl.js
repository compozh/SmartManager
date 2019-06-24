export default {
  name: 'smTasksItemRl',
  data: () => ({
    iFrameHeight: ''
  }),
  methods: {
    goToTaskInfo(taskId) {
      this.$router.push({name: 'SMARTMANAGERTASKDETAIL', params: {taskId}})
    }
  },
  render() {
    return this.$scopedSlots.default({
      taskLink: this.goToTaskInfo,
      params: {}
    })
  }
}