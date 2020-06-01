<template>
  <div class="d-flex justify-space-between mt-5">
    <div v-for="(participants, index) in taskParticipants"
         :key="index" style="flex: 1"
         :class="{'text-right': index === 'observers'}">
      <div class="d-flex">
        <fa-icon :icon="participants.icon" class="mr-3" size="lg"/>
        <span class="font-weight-light text-truncate">
        {{ participants.title.toUpperCase() }}</span>
      </div>
      <div class="py-2 d-flex flex-wrap">
        <v-autocomplete :value="participants.users"
                        @input="changeParticipants($event, participants.group)"
                        :items="users"
                        :placeholder="participants.placeholder"
                        multiple
                        append-icon
                        solo flat
                        dense chips
                        hide-details
                        hide-no-data
                        item-text="userId"
                        return-object>

          <template #selection="data" :class="{'text-right': index === 'observers'}">
            <v-chip v-bind="data.attrs"
                    :input-value="data.selected"
                    outlined small
                    color="blue-grey"
                    @click="data.select"
                    class="d-flex justify-space-between"
                    style="flex: 1 0 40%;">
              <span class="text-truncate" style="color: #343434">
                {{ data.item.fio }}</span>
              <v-btn icon depressed x-small
                     class="mr-n2"
                     @click="remove(data.item.userId)">
                <fa-icon icon="times" color="#343434" size="lg"/>
              </v-btn>
            </v-chip>
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
    participants: Array
  },
  computed: {
    transformParticipants () {
      return this.participants.map(participant => {
        return {
          fio: participant.name,
          userId: participant.userId,
          role: participant.role
        }
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
    }
  },
  methods: {
    changeParticipants (participants, group) {
      const otherParticipants = group === 'COEXECUTOR'
        ? this.taskParticipants.observers.users
        : this.taskParticipants.coExecutors.users
      const allParticipants = [...participants, ...otherParticipants]
      const participantsWithName = allParticipants.map(participant => {
        participant.name = participant.fio
        return participant
      })
      this.$emit('input', participantsWithName)
    },
    remove (userId) {
      this.$emit('input', this.participants.filter(i => i.userId !== userId))
    }
  }
}
</script>

<style scoped>

  .v-input >>> .v-input__slot {
    padding: 0 !important;
  }

  .v-chip >>> .v-chip__content {
    width: 100%;
    justify-content: space-between;
  }

</style>
