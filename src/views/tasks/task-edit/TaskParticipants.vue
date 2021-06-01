<template>
  <div class="d-flex justify-space-between mt-5">
    <div v-for="(participants, index) in taskParticipants"
         :key="index" style="flex: 1"
         :class="{[`${mr}-10`]: index === 'coExecutors'}">

      <div v-if="!readonly || participants.users.length"
           :class="['d-flex', {'justify-end': index === 'observers'}]">
        <fa-icon :icon="participants.icon" :class="`${mr}-3`" size="lg"/>
        <span class="font-weight-light text-truncate">
        {{ participants.title.toUpperCase() }}</span>
      </div>

      <div v-if="!readonly || participants.users.length" class="py-2 d-flex flex-wrap">
        <v-autocomplete :value="participants.users"
                        @change="changeParticipants($event, participants.group)"
                        :items="users"
                        :placeholder="participants.placeholder"
                        multiple
                        append-icon
                        solo flat
                        dense chips
                        hide-details
                        hide-no-data
                        item-text="fio"
                        :reverse="index === 'observers'"
                        :readonly="readonly"
                        return-object>

          <template #selection="data">
            <v-tooltip top>
              <template #activator="{ on }">
                <v-chip v-on="on"
                        v-bind="data.attrs"
                        :input-value="data.selected"
                        outlined small
                        color="blue-grey"
                        @click="data.select"
                        class="d-flex justify-space-between mb-1"
                        style="flex-basis: 45%;">
              <span class="text-truncate" style="color: #343434">
                {{ data.item.fio }}</span>
                  <v-btn icon depressed x-small
                         :class="`${mr}-n2`"
                         @click="remove(data.item.userId, participants.group)">
                    <fa-icon icon="times" color="#343434" size="lg"/>
                  </v-btn>
                </v-chip>
              </template>
              <span>{{ data.item.fio }}</span>
            </v-tooltip>

          </template>

          <template #item="data">
            <div class="d-flex align-center">
              <div class="body-2">
                {{ data.item.fio }}
              </div>
            </div>
          </template>
        </v-autocomplete>
      </div>
    </div>
  </div>
</template>

<script>
import { users } from '@/mixins/users'

export default {
  name: 'TaskParticipants',
  mixins: [users],
  model: {
    prop: 'participants'
  },
  props: {
    participants: Array,
    readonly: Boolean
  },
  data: () => ({
    needInitValue: true,
    initTaskParticipants: ''
  }),
  computed: {
    transformParticipants () {
      return this.participants.map(participant => {
        const user = this.users.find(user => user.userId === participant.userId)
        const existingParticipant = Object.assign({}, user)
        existingParticipant.role = participant.role
        return existingParticipant
      })
    },
    taskParticipants () {
      return {
        coExecutors: {
          users: this.transformParticipants.filter(i => i.role === 'COEXECUTOR'),
          placeholder: this.$t('tasks.addCoexecutor'),
          title: this.$t('roles.coExecutors'),
          icon: 'users',
          group: 'COEXECUTOR'
        },
        observers: {
          users: this.transformParticipants.filter(i => i.role === 'OBSERVER'),
          placeholder: this.$t('tasks.addNotify'),
          title: this.$t('roles.notify'),
          icon: 'mail-bulk',
          group: 'OBSERVER'
        }
      }
    },
    participantsAreEqual () {
      const compare = (a, b) => a.userId > b.userId ? 1 : -1
      const a1 = this.participants.filter(p => p.role).sort(compare)
      const a2 = this.initTaskParticipants.filter(p => p.role).sort(compare)
      if (a1.length === a2.length) {
        return a1.every((i, idx) => {
          return i.userId === a2[idx].userId &&
            i.role === a2[idx].role
        })
      }
      return false
    }
  },
  watch: {
    participants (participants) {
      if (this.needInitValue) {
        this.needInitValue = false
        this.initTaskParticipants = participants
      } else {
        this.$store.commit('SET_TASK_CHANGED', !this.participantsAreEqual)
      }
    }
  },
  methods: {
    changeParticipants (participants, group) {
      const otherParticipants = group === 'COEXECUTOR'
        ? this.taskParticipants.observers.users
        : this.taskParticipants.coExecutors.users
      const newParticipants = participants.map(participant => {
        // For prevent changing the original user object
        const newParticipant = Object.assign({}, participant)
        newParticipant.role = group
        return newParticipant
      })
      const allParticipants = [...newParticipants, ...otherParticipants]
        .map(participant => {
          // For prevent changing the original user object
          const theParticipant = Object.assign({}, participant)
          theParticipant.name = participant.fio
          return theParticipant
        })
      this.$emit('input', allParticipants)
    },
    remove (id, role) {
      const filteredParticipants = this.participants.filter(participant => {
        return !(participant.userId === id && participant.role === role)
      })
      this.$emit('input', filteredParticipants)
    }
  }
}
</script>

<style scoped>

  .v-input >>> .v-input__slot {
    padding: 0 !important;
  }

  .v-input >>> .v-input__slot input {
    min-height: 26px;
    align-self: start;
    padding: 0;
    text-overflow: ellipsis;
  }

  .v-input >>> .v-input__slot .v-select__selections {
    align-items: start;
  }

  .v-chip >>> .v-chip__content {
    width: 100%;
    justify-content: space-between;
  }

</style>
