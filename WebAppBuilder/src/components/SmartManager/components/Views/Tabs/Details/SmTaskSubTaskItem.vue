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
                <v-flex shrink>
                  <span class="icon-group d-flex align-center">
                    <v-tooltip top>
                      <template v-slot:activator="{ on }">
                        <v-icon v-if="subTask.priority" v-on="on">priority_high</v-icon>
                      </template>
                      <span>Высокий приоритет</span>
                    </v-tooltip>
                    <v-tooltip top>
                      <template v-slot:activator="{ on }">
                        <v-icon v-if="subTask.hasOrig" v-on="on">attach_file</v-icon>
                      </template>
                      <span>Есть вложения</span>
                    </v-tooltip>
                    <v-tooltip top>
                      <template v-slot:activator="{ on }">
                        <v-icon v-if="subTask.isAgree" class="ml-1" v-on="on">playlist_add_check</v-icon>
                      </template>
                      <span>Требует согласования</span>
                    </v-tooltip>
                    <v-tooltip top>
                      <template v-slot:activator="{ on }">
                        <v-icon v-if="subTask.hasComm" class="ml-1" v-on="on">chat_bubble_outline</v-icon>
                      </template>
                      <span>Есть коментарии</span>
                    </v-tooltip>
                    <v-tooltip top>
                      <template v-slot:activator="{ on }">
                        <v-icon v-if="subTask.isMy" class="ml-1" v-on="on">face</v-icon>
                      </template>
                      <span>Задача от меня</span>
                    </v-tooltip>
                    <v-tooltip top>
                      <template v-slot:activator="{ on }">
                        <v-icon
                          v-on="on"
                          size="16px"
                          :color="taskStatus.color"
                          class="ml-1"
                        >{{ taskStatus.icon }}</v-icon>
                      </template>
                      <span>{{ taskStatus.text }}</span>
                    </v-tooltip>
                  </span>
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
    props: ['subTask'],
    computed: {
      taskStatus() {
        switch (this.subTask.status) {
          case '':
            return {
              color: 'orange darken-2',
              icon: 'access_time',
              text: 'ожидает'
            }
          case '*':
            return {
              color: 'blue-grey darken-1',
              icon: 'loop',
              text: 'в работе'
            }
          case '-':
            return {
              color: 'red darken-2',
              icon: 'highlight_off',
              text: 'отклонена'
            }
          case '+':
            return {
              color: 'green darken-2',
              icon: 'check_circle_outline',
              text: 'выполнена'
            }
        }
      }
    }
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

  .v-chip {
    height: 22px !important;
    font-size: 12px
  }

  .v-chip:focus {
    background-color: red;
  }

  .v-chip >>> .v-chip__content {
    cursor: pointer;
  }

  .unread {
    border-left-color: #1976D2;
  }
</style>