<template>
  <v-container fluid pa-0 px-2>
    <v-layout row wrap justify-center>
      <v-flex
        xs12
        class="task-container"
        v-for="task in tasks"
        :key="task.id"
      >
        <v-card
          flat
          class="task-item"
          @click="goToTaskInfo(task.id)"
        >
          <v-layout row align-center>
            <v-flex d-flex justify-center shrink px-3>
              <user-icon :src="task.addedPhoto" size="50"></user-icon>
            </v-flex>
            <v-flex py-1 pr-2 class="text-ellipsis">
              <v-layout column text-xs-left>
                <v-flex class="text-ellipsis">
                  <span
                    class="body-2 font-weight-light blue--text text--darken-2"
                  >{{ task.name }}</span>
                </v-flex>
                <v-flex class="caption text-ellipsis">
                  <span class="hidden-xs-only"
                  >Исполнитель: </span>{{ task.addedFio }}
                </v-flex>
                <v-flex d-flex class="caption grey--text">
                  <v-flex class="text-xs-left">
                    <span class="hidden-xs-only"
                    >Дата добавления: </span>{{ task.dateadd }}
                  </v-flex>
                  <v-flex class="text-xs-right">
                    <span class="hidden-xs-only"
                    >Идентификатор: </span>{{ task.id }}
                  </v-flex>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-card>
      </v-flex>
      <v-flex
        class="empty-state-block"
        v-if="!checkTasks"
        xs12
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
    name: "sm-tasks",
    //props: ["tasks"],
    data() {
      return {
        loading: false
      }
    },
    components: {
      emptyStateImg
    },
    created() {
      if (this.tasks === null) {
        this.$store.dispatch('getTasks', this.$route.params.foldercode)
      }
    },
    watch: {
      '$route'(to, from) {
        const currentFolderId = from.params.foldercode
        const targetFolderId = to.params.foldercode

        if (currentFolderId !== targetFolderId) {
          this.$store.dispatch('getTasks', targetFolderId)
        }
      }
    },
    computed: {
      tasks() {
        return this.$store.getters.tasks
      },
      checkTasks() {
        return this.tasks ? this.tasks.length : 0;
      }
    },
    methods: {
      // beforeRouteUpdate(to, from, next) {
      //   if (this.$store.getters.getAppData("SMTASKS")) {
      //     this.tasks = this.$store.getters.getAppData("SMTASKS").data.smtasks.tasks;
      //   }
      // },
      goToTaskInfo(taskId) {
        this.$router.push({name: 'SMARTMANAGERTASKDETAIL', params: {taskId}})
      }
    }
  }
</script>

<style scoped>
  .user-icon {
    max-height: 50px;
    max-width: 50px;
    border-radius: 50%;
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

  .task-container {
    overflow: hidden;
  }

  .task-item {
    box-shadow: inset 0 -1px 0 rgba(100, 121, 143, 0.122);
  }

  .task-item:hover {
    cursor: pointer;
    background: rgb(250, 250, 250);
  }

  .text-ellipsis {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>