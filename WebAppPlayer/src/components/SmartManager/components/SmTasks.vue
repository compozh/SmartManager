<template>
  <v-container fluid pa-0 px-2>
    <v-layout row wrap justify-center>
      <v-flex
        xs12
        class="task-container"
        v-for="task in tasks"
        :key="task.id"
      >
        <sm-task-list-item :task="task"></sm-task-list-item>
      </v-flex>
      <sm-empty-state v-if="!checkTasks">Нет задач в папке</sm-empty-state>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    name: 'sm-tasks',
    created() {
      const folderId = this.$route.params.foldercode
      this.getTasks(folderId)
    },
    watch: {
      '$route'(to, from) {
        const currentFolder = from.params.foldercode
        const targetFolder = to.params.foldercode
        if (currentFolder !== targetFolder) {
          this.getTasks(targetFolder)
        }
      }
    },
    computed: {
      tasks() {
        return this.$store.getters['sm/tasks']
      },
      checkTasks() {
        return this.tasks ? this.tasks.length : 0
      }
    },
    methods: {
      getTasks(folderId) {
        this.$store.commit('sm/setCurrentFolder', folderId)
        const loader = this.tasks ? 'setLinearLoader' : 'setCircularLoader'
          this.$store.dispatch('sm/getTasks', {folderId, loader})
      }
    }
  }
</script>

<style scoped>
  .task-container {
    overflow: hidden;
  }
</style>