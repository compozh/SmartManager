export default {
  name: 'smTasksItemRl',
  data: () => ({

  }),
  created() {

  },
  computed: {

  },
  methods: {
    goToTaskInfo(taskId) {
      this.$router.push({name: 'SMARTMANAGERTASKDETAIL', params: {taskId}})
    }
  },
  render() {
    return this.$scopedSlots.default({
      taskDetailLink: this.goToTaskInfo,
      props: {

      }
    })
  }
}