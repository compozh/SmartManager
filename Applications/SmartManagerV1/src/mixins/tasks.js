export const tasks = {
  computed: {
    tasks() {
      return this.$store.getters['sm/tasks']
    }
  },
  methods: {
    async getTasks(folderId, loader) {
      await this.$store.dispatch('sm/getTasks', {folderId, loader})
    }
  }
}
