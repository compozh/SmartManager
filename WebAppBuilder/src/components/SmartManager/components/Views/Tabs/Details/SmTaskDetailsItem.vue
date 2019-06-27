<template>
  <sm-tasks-item-rl v-slot="{}">
    <v-container fluid pa-0 pr-2>
      <v-layout row wrap text-xs-left>
        <v-flex xs12 pt-2>
          <v-chip
            v-for="option in options"
            small outline disabled
            :color="option.color"
          >
            <v-avatar>
              <v-icon size="18">
                {{ option.icon }}
              </v-icon>
            </v-avatar>
            {{ option.title }}
          </v-chip>
        </v-flex>
        <v-flex xs12 py-2>
          <span
            class="subheading blue-grey--text"
          >{{ task.name }}</span>
        </v-flex>
        <v-flex xs12>
          <v-layout row wrap>
            <v-flex xs12>
              <v-layout
                v-for="role in members"
              >
                <v-flex
                  xs4 sm3 md2
                  grow text-xs-right
                  class="role-title">
                  <span class="title-field">
                    {{ role.title }}:
                  </span>
                </v-flex>
                <v-flex>
                  <v-chip
                    v-for="member in role.members"
                    small outline disabled
                    :color="role.color"
                  >
                    <v-avatar>
                      <v-icon size="18">
                        {{ role.icon }}
                      </v-icon>
                    </v-avatar>
                    {{ member }}
                  </v-chip>
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex>
              <v-layout row wrap py-2>
                <v-flex xs6 class="date-field">
                  <v-icon size="22">date_range</v-icon>
                  <span class="pl-1 pt-1 title-field">
                    Создано: <b class="subheading">{{ task.dateAdd }}</b>
                  </span>
                </v-flex>
                <v-flex xs6 class="date-field" justify-end>
                  <v-icon
                    :class="dateStatus"
                    size="22"
                  >date_range
                  </v-icon>
                  <span
                    class="pl-1 pt-1 title-field"
                    :class="dateStatus"
                  >
                    Срок до: <b class="subheading">{{ task.dateplan }}</b>
                  </span>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>

      <sm-task-description
        v-if=task.htmlDescript
        :description="task.htmlDescript"
      ></sm-task-description>
    </v-container>
  </sm-tasks-item-rl>
</template>

<script>

  import moment from 'moment'

  export default {
    name: 'sm-task-details-item',
    props: ['task'],
    components: {
      moment
    },
    computed: {
      options() {
        const options = []
        const myControl = this.task.myControl
        const needApprov = this.task.needApprov
        const priority = this.task.priority

        if (myControl) {
          options.push({
            title: 'На контроле',
            color: 'red darken-4',
            icon: 'remove_red_eye'
          })
        }
        if (needApprov) {
          options.push({
            title: 'Требует утверждения',
            color: 'blue-grey darken-2',
            icon: 'check_circle_outline'
          })
        }
        if (priority) {
          switch (priority) {
            case 1:
              options.push({
                title: 'Высокий приоритет',
                color: 'green darken-2',
                icon: 'error_outline'
              })
              break
            case -1:
              options.push({
                title: 'Не срочно',
                color: 'grey darken-2',
                icon: 'low_priority'
              })
              break
          }
        }
        return options
      },
      participants() {
        const participants = this.task.participants
        participants.push({
          name: this.task.addedFio,
          role: "addedFio"
        })
        return participants
      },
      members() {
        const result = {}
        const members = this.participants
        members.forEach(member => {
          const name = member.name
          const role = member.role
          result[role]
            ? result[role].members.push(name)
            : result[role] = Object.assign({members: [name]}, this.defineRole(role))
        })
        return result
      },
      dateStatus() {
        const planDate = this.task.dateplan
        const isExpired = moment(planDate, 'DD.MM.YYYY HH:mm').isBefore()
        if (isExpired) {
          return 'red--text text--darken-4'
        }
      }
    },
    methods: {
      defineRole(role) {
        switch (role) {
          case '':
            return {
              title: 'Ответственный',
              color: 'blue darken-2',
              icon: 'account_circle'
            }
          case 'COEXECUTOR':
            return {
              title: 'Соисполнители',
              color: 'blue darken-2',
              icon: 'supervised_user_circle'
            }
          case 'OBSERVER':
            return {
              title: 'Уведомить',
              color: 'orange darken-4',
              icon: 'error_outline'
            }
          case 'addedFio':
            return {
              title: 'Задача от',
              color: 'blue-grey darken-4',
              icon: 'loupe'
            }
        }
      }
    }
  }
</script>

<style scoped>
  .bottom-divider {
    box-shadow: inset 0 -1px 0 rgba(100, 121, 143, 0.122);
  }

  .text-ellipsis {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .v-chip {
    height: 20px !important;
    font-size: 11px
  }

  .title-field {
    font-size: 12px;
    color: gray;
  }

  .role-title {
    padding-top: 2px;
  }

  .date-field .title-field b {
    font-size: 13px !important;
  }

  .date-field {
    display: flex;
    align-items: center;
  }

</style>