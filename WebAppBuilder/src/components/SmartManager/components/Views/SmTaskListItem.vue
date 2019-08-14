<template>
  <sm-tasks-item-rl
    v-slot="{ taskLink }"
  >
    <v-card
      flat
      class="task-item pl-3"
      :class="{ unread: !task.isRead }"
      @click="taskLink(task.id)"
    >
      <v-layout row align-center>
        <v-flex d-flex justify-center shrink pr-3 class="icon-container">
          <user-icon :src="task.addedPhoto" size="50"></user-icon>
        </v-flex>
        <v-flex py-1 class="text-ellipsis">
          <v-layout column text-xs-left>
            <v-flex>
              <v-layout>
                <v-flex class="text-ellipsis">
                  <span
                    class="body-2 font-weight-light blue--text text--darken-2"
                  >{{ task.name }}</span>
                </v-flex>
                <v-flex d-flex shrink>
                  <sm-task-icons :task="task"></sm-task-icons>
                  <sm-task-status :status="task.status" chip="true"></sm-task-status>
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex class="caption text-ellipsis">
              <span class="hidden-xs-only"
              >Исполнитель: </span>{{ task.addedFio }}
            </v-flex>
            <v-flex d-flex class="caption grey--text">
              <v-flex class="text-xs-left">
                <span class="hidden-xs-only"
                >Добавлено: </span>{{ task.dateAdd }}
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
  </sm-tasks-item-rl>
</template>

<script>
  export default {
    name: 'SmTaskListItem',
    props: ['task']
  }
</script>

<style scoped>
  .task-item {
    box-shadow: inset 0 -1px 0 rgba(100, 121, 143, 0.122);
    border-left: 5px solid transparent;
    border-radius: 0;
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

  .unread {
    border-left-color: #1976D2;
  }

  .icon-container {
    max-width: 50px;
  }
</style>
