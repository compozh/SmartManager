<template>
  <div class="d-flex flex-wrap mt-5">
    <div class="d-flex" style="flex-basis: 100%">
      <fa-icon icon="users" :class="`${mr}-3`" size="lg"/>
      <span class="font-weight-light text-truncate">
      {{ $t('cases.participants').toUpperCase() }}</span>
    </div>
    <div class="py-2 d-flex flex-wrap">
      <v-autocomplete :value="caseParticipants"
                      @change="changeParticipants"
                      :items="users"
                      :placeholder="$t('cases.selectParticipants')"
                      multiple
                      append-icon
                      solo flat
                      dense chips
                      hide-details
                      hide-no-data
                      item-text="fio"
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
                      class="d-flex mb-1">
            <span class="text-truncate" style="color: #343434">
              {{ data.item.fio }}</span>
                <v-btn icon depressed x-small
                       :class="`${mr}-n2`"
                       @click="remove(data.item.userId)">
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
</template>

<script>
import { users } from '@/mixins/users'

export default {
  name: 'CaseParticipants',
  mixins: [users],
  model: {
    prop: 'participants'
  },
  props: {
    participants: Array
  },
  data: () => ({
    needInitValue: true,
    initCaseParticipants: []
  }),
  computed: {
    caseParticipants () {
      return this.participants.map(participant => {
        return { ...this.users.find(user => user.userId === participant.userId) }
      })
    },
    participantsAreEqual () {
      const compare = (a, b) => a.userId > b.userId ? 1 : -1
      const p1 = [...this.participants].sort(compare)
      const p2 = [...this.initCaseParticipants].sort(compare)
      if (p1.length === p2.length) {
        return p1.every((i, idx) => {
          return i.userId === p2[idx].userId
        })
      }
      return false
    }
  },
  watch: {
    participants (participants) {
      if (this.needInitValue) {
        this.needInitValue = false
        this.initCaseParticipants = participants
      } else {
        this.$store.commit('SET_CASE_CHANGED', !this.participantsAreEqual)
      }
    }
  },
  methods: {
    changeParticipants (participants) {
      const newParticipants = participants.map(participant => {
        participant.name = participant.fio
        return participant
      })
      this.$emit('input', newParticipants)
    },
    remove (id) {
      const filteredParticipants = this.participants.filter(participant => {
        return !(participant.userId === id)
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
