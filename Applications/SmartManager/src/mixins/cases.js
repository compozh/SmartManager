export const tasks = {
  computed: {
    tasks() {
      return this.$store.getters['sm/tasks']
    }
  },
  methods: {
    async getTasks(folderId) {
      await this.$store.dispatch('sm/getTasks', folderId)
    }
  }
}
