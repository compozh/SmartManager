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
      <v-flex
        xs12
        v-if="!checkTasks"
        class="empty-state-block"
      >
        <empty-state-img class="empty-state-image"></empty-state-img>
        <span class="title grey--text font-weight-thin pa-2">Нет задач в папке</span>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import emptyStateImg from './empty-grid-state.svg'

  export default {
    name: 'sm-tasks',
    components: {
      emptyStateImg
    },
    created() {
      const folder = this.$route.params.foldercode
      this.getTasks(folder)
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
        return this.tasks
          ? this.tasks.length
          : 0
      }
    },
    methods: {
      getTasks(folder) {
        this.$store.commit('sm/setCurrentFolder', folder)
        this.tasks
          ? this.$store.dispatch('sm/updateTasks', folder)
          : this.$store.dispatch('sm/getTasks', folder)
      }
    }
  }
</script>

<style scoped>
  .task-container {
    overflow: hidden;
  }

  .empty-state-block {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 50vh;
  }

  .empty-state-image {
    width: 200px;
  }

  /* SVG image colors */
  .empty-state-image .c {
    fill: #f1f1f1;
  }

  .empty-state-image .d {
    fill: #c5c5c5;
  }

  .empty-state-image .e {
    fill: #efefef;
  }
</style>