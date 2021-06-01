<template>
  <div :class="`d-flex align-center ${mr}-5 py-3`">
    <v-divider vertical :class="`${mr}-5`"/>
    <div class="d-flex flex-column"
         style="white-space: nowrap">
      <div class="overline">
        <fa-icon icon="clock"
                 :class="`text--secondary ${mr}-1`" size="lg"/>
        {{ $t('tasks.deadline') }}:</div>
      <div class="d-flex">
        <!-- DATE PICKER MENU -->
        <v-menu v-model="dateMenu"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y min-width="200px">
          <template #activator="{ on }">
            <v-text-field id="date"
                          v-on="taskEditable ? on : ''"
                          :value="textFieldDate"
                          readonly hide-details
                          solo flat dense
                          class="body-2 red--text text--darken-4"/>
          </template>
          <v-date-picker v-model="date"
                         :readonly="!taskEditable"
                         @change="dateTimeChanged"
                         first-day-of-week="1"
                         no-title
                         scrollable>
            <v-spacer/>
          </v-date-picker>
        </v-menu>

        <!-- TIME PICKER MENU -->
        <v-menu ref="timePicker"
                v-model="timeMenu"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y>
          <template #activator="{ on }">
            <v-text-field id="time"
                          v-show="!datePlan.includes('01.01.0001')"
                          v-on="taskEditable ? on : ''"
                          :value="time"
                          readonly hide-details
                          solo flat dense
                          class="body-2 red--text text--darken-4"/>
          </template>
          <v-time-picker v-if="timeMenu"
                         v-model="time"
                         :readonly="!taskEditable"
                         @change="dateTimeChanged"
                         no-title
                         scrollable format="24hr"
                         @click:minute="$refs.timePicker.save(time)"/>
        </v-menu>
      </div>
    </div>
  </div>
</template>

<script>
import { date } from '@/mixins/dateTime'

export default {
  name: 'TaskPlanDate',
  mixins: [date],
  model: {
    prop: 'datePlan'
  },
  props: {
    datePlan: String
  },
  data: () => ({
    dateMenu: false,
    timeMenu: false,
    inputDate: '',
    inputTime: ''
  }),
  computed: {
    dateTime () {
      return this.parseDateTime(this.datePlan)
    },
    textFieldDate () {
      return this.datePlan.includes('01.01.0001')
        ? this.$t('pickers.noTimeLimit')
        : this.datePlan.split(' ').shift()
    },
    date: {
      get () {
        return this.datePlan.includes('01.01.0001')
          ? this.defaultPlanDate
          : this.dateTime.format('YYYY-MM-DD')
      },
      set (val) {
        const date = this.formatDate(val)
        if (this.inputDate !== date) {
          this.inputDate = date
          this.$emit('input', `${this.inputDate} ${this.time}`)
        }
      }
    },
    time: {
      get () {
        return this.datePlan.split(' ').pop()
      },
      set (val) {
        if (this.inputTime !== val) {
          this.inputTime = val
          this.$emit('input', `${this.textFieldDate} ${this.inputTime}`)
        }
      }
    },
    taskEditable () {
      return this.$store.state.tasks.taskEditable
    }
  },
  methods: {
    dateTimeChanged () {
      this.$store.commit('SET_TASK_CHANGED', true)
    }
  }
}

</script>

<style scoped>

  .v-input >>> .v-input__control {
    min-height: 20px !important;
    padding: 0 !important;
  }

  .v-input >>> .v-input__slot {
    min-height: 20px !important;
    padding: 0 !important;
  }

  .v-input >>> #date,
  .v-input >>> #time {
    width: 75px !important;
    color: #B71C1C !important;
    caret-color: #3f51b5 !important;
    padding: 0 !important;
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
  }

  .v-input >>> #time {
    width: 40px !important;
  }

</style>
