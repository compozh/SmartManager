<template>
  <sm-tasks-item-rl v-slot="{}">
    <v-container>
      <v-layout row align-center>
        <v-flex d-flex justify-center shrink pr-3>
          <user-icon :src="task.addedPhoto" size="50"></user-icon>
        </v-flex>
        <v-flex py-1 class="text-ellipsis">
          <v-layout column text-xs-left>
            <v-flex>
              <v-layout>
                <v-flex>
                  <span
                    class="body-1 font-weight-light blue--text text--darken-2"
                  >{{ task.name }}</span>
                </v-flex>
                <v-flex shrink>
                  <sm-task-icons :task="task"></sm-task-icons>
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
      <sm-task-description :task="task"></sm-task-description>
    </v-container>
  </sm-tasks-item-rl>
</template>

<script>
  export default {
    name: 'sm-task-details-item',
    props: ['task']
  }
</script>

<style scoped>
  .task-item {
    box-shadow: inset 0 -1px 0 rgba(100, 121, 143, 0.122);
    border-radius: 0;
  }

  .text-ellipsis {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>