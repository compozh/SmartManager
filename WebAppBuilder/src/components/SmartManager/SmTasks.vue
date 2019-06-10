<template>
  <v-container fluid pa-2>
    <v-layout v-if="loading">
      <v-flex xs12>
        <v-progress-circular
          :size="100"
          color="blue darken-2"
          indeterminate
        ></v-progress-circular>
      </v-flex>
    </v-layout>
    <v-layout v-else row wrap justify-center>
      <v-flex xs12 md9 lg7 mb-2
              v-for="task in tasks"
              :key="task.id"
      >
        <v-card
          class="task-item"
          @click="goToTaskInfo(task.id)"
        >
          <v-layout row wrap align-center>
            <v-flex xs2 sm1 d-flex justify-center>
              <user-icon :src="task.addedPhoto" size="50"></user-icon>
            </v-flex>
            <v-flex xs10 sm11 py-1 pr-2>
              <v-layout column text-xs-left>
                <v-flex class="text-ellipsis">
                  <span
                    class="body-2 font-weight-light blue--text text--darken-2"
                  >{{ task.name }}</span>
                </v-flex>
                <v-flex class="caption">
                  <span>Исполнитель: {{ task.addedFio }}</span>
                </v-flex>
                <v-flex
                  d-flex
                  justify-space-between
                  class="caption grey--text"
                >
                  <span class="text-xs-left">Дата добавления: {{ task.dateadd }}</span>
                  <span class="text-xs-right">Идентификатор: {{ task.id }}</span>
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
    props: ["tasks"],
    data() {
      return {
        loading: false
      }
    },
    components: {
      emptyStateImg
    },
    computed: {
      checkTasks() {
        return this.tasks ? this.tasks.length : 0;
      }
    },
    methods: {
      beforeRouteUpdate(to, from, next) {
        if (this.$store.getters.getAppData("SMTASKS")) {
          this.tasks = this.$store.getters.getAppData("SMTASKS").data.smtasks.tasks;
        }
      },
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