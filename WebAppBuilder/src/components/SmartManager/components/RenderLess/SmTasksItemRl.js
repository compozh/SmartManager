export default {
  name: 'sm-tasks-item-rl',
  computed: {
    task() {
      return this.$store.getters['sm/taskInfo']
    }
  },
  methods: {
    goToTaskInfo(taskId) {
      this.$store.dispatch('sm/getTaskInfo', taskId)
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