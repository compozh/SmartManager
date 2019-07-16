<template>
  <v-container fluid pa-0 px-2>
    <sm-task-add-form v-if="taskAddForm"></sm-task-add-form>
    <v-layout v-else row wrap justify-center pb-5 mb-4>
      <v-flex
        xs12
        class="task-container"
        v-for="task in tasks"
        :key="task.id"
      >
        <sm-task-list-item :task="task"></sm-task-list-item>
      </v-flex>
      <sm-empty-state v-if="!checkTasks">Нет задач в папке</sm-empty-state>
      <v-flex>

        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-btn
              fixed
              dark
              fab
              bottom
              right
              v-on="on"
              color="blue darken-2"
              @click="openTaskAddForm"
            >
              <v-icon>add</v-icon>
            </v-btn>
          </template>
          <span>Добавить задачу</span>
        </v-tooltip>

      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    name: 'sm-tasks',
    data: () => ({
      showAddForm: false
    }),
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
      },
      taskAddForm() {
        return this.$store.state.sm.taskAddForm === 'open'
      }
    },
    methods: {
      getTasks(folderId) {
        this.$store.commit('sm/setCurrentFolder', folderId)
        const loader = this.tasks ? 'setLinearLoader' : 'setCircularLoader'
        this.$store.dispatch('sm/getTasks', {folderId, loader})
      },
      openTaskAddForm() {
        this.$store.commit('sm/setTaskAddForm', 'open')
      },
      closeTaskAddForm() {
        this.$store.commit('sm/setTaskAddForm', 'close')
      }
    }
  }
</script>

<style scoped>
  .task-container {
    overflow: hidden;
  }
</style>