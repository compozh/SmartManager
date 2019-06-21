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
        <v-flex d-flex justify-center shrink pr-3>
          <user-icon :src="task.addedPhoto" size="50"></user-icon>
        </v-flex>
        <v-flex py-1 pr-2 class="text-ellipsis">
          <v-layout column text-xs-left>
            <v-flex>
              <v-layout>
                <v-flex class="text-ellipsis">
                  <span
                    class="body-2 font-weight-light blue--text text--darken-2"
                  >{{ task.name }}</span>
                </v-flex>
                <v-flex shrink>
                  <span class="icon-group d-flex align-center">
                    <v-tooltip top>
                      <template v-slot:activator="{ on }">
                        <v-icon v-if="task.priority" v-on="on">priority_high</v-icon>
                      </template>
                      <span>Высокий приоритет</span>
                    </v-tooltip>
                    <v-tooltip top>
                      <template v-slot:activator="{ on }">
                        <v-icon v-if="task.hasOrig" v-on="on">attach_file</v-icon>
                      </template>
                      <span>Есть вложения</span>
                    </v-tooltip>
                    <v-tooltip top>
                      <template v-slot:activator="{ on }">
                        <v-icon v-if="task.isAgree" class="ml-1" v-on="on">playlist_add_check</v-icon>
                      </template>
                      <span>Требует согласования</span>
                    </v-tooltip>
                    <v-tooltip top>
                      <template v-slot:activator="{ on }">
                        <v-icon v-if="task.hasComm" class="ml-1" v-on="on">chat_bubble_outline</v-icon>
                      </template>
                      <span>Есть коментарии</span>
                    </v-tooltip>
                    <v-tooltip top>
                      <template v-slot:activator="{ on }">
                        <v-icon v-if="task.isMy" class="ml-1" v-on="on">face</v-icon>
                      </template>
                      <span>Задача от меня</span>
                    </v-tooltip>
                    <v-tooltip top>
                      <template v-slot:activator="{ on }">
                        <v-icon
                          v-on="on"
                          :color="taskStatus.color"
                          class="hidden-sm-and-up ml-1"
                        >{{ taskStatus.icon }}</v-icon>
                      </template>
                      <span>{{ taskStatus.text }}</span>
                    </v-tooltip>
                    <v-chip
                      disabled
                      small outline
                      class="hidden-xs-only ma-0 ml-1"
                      :color="taskStatus.color"
                    >
                      <v-avatar>
                        <v-icon size="18px">{{ taskStatus.icon }}</v-icon>
                      </v-avatar>{{ taskStatus.text }}
                    </v-chip>
                  </span>
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
    name: 'SmTaskDetailsItem',
    props: ['task'],
    computed: {
      taskStatus() {
        switch (this.task.status) {
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