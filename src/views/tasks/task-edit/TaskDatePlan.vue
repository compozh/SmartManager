<template>
  <div class="d-flex align-center mx-5 py-3">
    <v-divider vertical class="mr-5"></v-divider>
    <div class="d-flex flex-column"
         style="white-space: nowrap">
      <div class="overline">
        <fa-icon icon="clock"
                 class="text--secondary mr-1" size="lg"/>
        {{ $t('tasks.deadline') }}:</div>
      <div class="d-flex">
        <!-- DATE PICKER -->
        <v-menu ref="datePicker"
                v-model="dateMenu"
                :close-on-content-click="false"
                :return-value.sync="date"
                transition="scale-transition"
                offset-y
                min-width="200px">
          <template v-slot:activator="{ on }">
            <v-text-field id="date"
                          :value="textFieldDate"
                          readonly
                          hide-details
                          solo flat dense
                          v-on="on"
                          class="body-2 red--text text--darken-4"/>
          </template>
          <v-date-picker v-model="date"
                         first-day-of-week="1"
                         no-title
                         scrollable>
            <v-spacer/>
            <v-btn text color="primary"
                   @click="dateMenu = false">
              {{ $t('buttons.cancel') }}</v-btn>
            <v-btn text color="primary"
                   @click="changeDate">OK</v-btn>
          </v-date-picker>
        </v-menu>

        <!-- TIME PICKER -->
        <v-menu ref="timePicker"
                v-model="timeMenu"
                :close-on-content-click="false"
                :return-value.sync="time"
                transition="scale-transition"
                offset-y
                max-width="250px"
                min-width="250px">
          <template v-slot:activator="{ on }">
            <v-text-field id="time"
                          :value="time"
                          readonly
                          hide-details
                          solo flat dense
                          v-on="on"
                          class="body-2 red--text text--darken-4"/>
          </template>
          <v-time-picker v-model="time"
                         no-title full-width
                         scrollable
                         format="24hr"
                         @click:minute="changeTime"/>
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
      return this.datePlan.split(' ').shift()
    },
    date: {
      get () {
        return this.formatPickerDate(this.dateTime)
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
    }
  },
  methods: {
    changeDate () {
      this.$refs.datePicker.save(this.date)
      this.$store.commit('SET_TASK_CHANGED', true)
    },
    changeTime () {
      this.$refs.timePicker.save(this.time)
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
