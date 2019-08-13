// Renderless component for SmTaskDetailsItem.vue (SmartManager \ components \ Views \ Tabs \ Details )
// Inherits from SmTasksItemRl.js

import moment from 'moment'
import smTasksItemRl from './SmTasksItemRl'

export default {
  name: 'sm-task-details-item-ext',
  extends: smTasksItemRl,
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
      // Добавляем поле "Задача от" если такого еще нет
      const participants = this.task.participants
      const newParticipant = {
        name: this.task.addedFio,
        role: 'addedFio'
      }
      if (!participants.some(i => i.role === 'addedFio')) {
        participants.push(newParticipant)
      }
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
  },
  render() {
    return this.$scopedSlots.default({
      task: this.task,
      options: this.options,
      members: this.members,
      dateStatus: this.dateStatus
    })
  }
}
