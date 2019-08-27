<template>
  <v-container fluid pa-0 px-2>
    <sm-task-add-form v-if="taskAddForm"></sm-task-add-form>
    <v-layout v-else row wrap justify-center pb-5 mb-4>
      <v-flex
        xs12
        ref="tasks"
        class="task-container"
        v-for="task in tasks"
        :key="task.id"
        :id="'id' + task.id"
      >
        <sm-task-list-item
          v-if="intersection(task.id)"
          :task="task"
        ></sm-task-list-item>
      </v-flex>
      <sm-empty-state v-if="!checkTasks">{{ $t('sm.tasks.noTasks') }}</sm-empty-state>
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
          <span>{{ $t('sm.buttons.addTask') }}</span>
        </v-tooltip>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'sm-tasks',
  data: () => ({
    showAddForm: false,
    lazyTasks: []
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
    },
    tasks(tasks) {
      if (tasks.length === this.$refs.tasks.length) {
        this.lazyLoad()
      }
    }
  },
  computed: {
    tasks() {
      return this.$store.getters['sm/tasks']
    },
    // eslint-disable-next-line vue/return-in-computed-property
    checkTasks() {
      return this.tasks ? this.tasks.length : 0
    },
    taskAddForm() {
      return this.$store.state.sm.taskAddForm === 'open'
    }
  },
  methods: {
    getFolders() {
      this.$store.dispatch('sm/getFolders', {loader: 'setLinearLoader'})
    },
    getTasks(folderId) {
      this.$store.commit('sm/setCurrentFolder', folderId)
      const loader = this.tasks ? 'setLinearLoader' : 'setCircularLoader'
      this.$store.dispatch('sm/getTasks', {folderId, loader})
        .then(() => this.lazyLoad())
    },
    openTaskAddForm() {
      this.$store.commit('sm/setTaskAddForm', 'open')
    },
    closeTaskAddForm() {
      this.$store.commit('sm/setTaskAddForm', 'close')
    },
    lazyLoad() {
      this.lazyTasks.length = 0
      const callback = entries => entries.forEach(entry => {
        if (entry.isIntersecting) {
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.lazyTasks.push(entry.target.id)
        }
      })
      const observer = new IntersectionObserver(callback)
      const elements = document.querySelectorAll('.task-container')
      elements.forEach(element => observer.observe(element))
    },
    intersection(id) {
      return this.lazyTasks.includes(String(id))
    }
  }
}
</script>

<style scoped>
  .task-container {
    overflow: hidden;
    min-height: 70px;
  }
</style>
