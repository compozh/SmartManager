<template>
  <sm-tasks-item-rl
    v-slot="{ taskLink }"
  >
    <v-card
      flat
      class="task-item"
      @click="taskLink(subTask.id)"
    >
      <v-layout row align-center>
        <v-flex py-1 pr-2 class="text-ellipsis">
          <v-layout column text-xs-left>
            <v-flex>
              <v-layout>
                <v-flex class="text-ellipsis">
                  <span
                    class="body-2 font-weight-light blue--text text--darken-2"
                  >{{ subTask.name }}</span>
                </v-flex>
                <v-flex d-flex shrink>
                  <sm-task-icons :task="subTask"></sm-task-icons>
                  <sm-task-status :task="subTask"></sm-task-status>
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex d-flex class="caption">
              <v-flex class="text-ellipsis">
                {{ subTask.addedFio }}
              </v-flex>
              <v-flex class="green--text text--darken-2 text-xs-right">
                <span class="hidden-xs-only"
                >Дата завершения: </span>{{ subTask.dateplan }}
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
  name: 'sm-task-sub-task-item',
  props: ['subTask']
}
</script>

<style scoped>
  .task-item {
    box-shadow: inset 0 -1px 0 rgba(100, 121, 143, 0.122);
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
</style>
