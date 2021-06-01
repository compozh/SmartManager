<template>
  <div class="d-flex">
    <!-- DATE PICKER -->
    <v-menu v-model="dateMenu"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y min-width="200px">
      <template #activator="{ on }">
        <v-text-field v-on="on"
                      :value="formatDate(date)"
                      :label="$t('pickers.date')"
                      :hint="checkDate"
                      persistent-hint
                      tabindex="3"
                      readonly solo flat dense
                      style="width: 155px !important;">
          <template #prepend-inner>
            <v-btn v-on="on"
                   text fab x-small
                   dark depressed
                   color="grey" :class="`${mr}-2`"
                   style="border: 1px dashed;">
              <fa-icon icon="calendar-day" type="fal" size="lg"/>
            </v-btn>
          </template>
        </v-text-field>
      </template>
      <v-date-picker v-model="date"
                     first-day-of-week="1"
                     no-title
                     scrollable>
      </v-date-picker>
    </v-menu>
    <v-spacer></v-spacer>
    <!-- TIME PICKER -->
    <v-menu ref="timePicker"
            v-model="timeMenu"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            max-width="250px"
            min-width="250px">
      <template #activator="{ on }">
        <v-text-field v-on="on"
                      :value="time"
                      :label="$t('pickers.time')"
                      tabindex="4"
                      readonly solo flat dense
                      style="width: 80px !important;"/>
      </template>
      <v-time-picker v-if="timeMenu"
                     v-model="time"
                     no-title full-width
                     scrollable
                     format="24hr"
                     @click:minute="$refs.timePicker.save(time)"/>
    </v-menu>
  </div>
</template>

<script>
import { date } from '@/mixins/dateTime'

export default {
  name: 'DateTimePickers',
  mixins: [date],
  model: {
    prop: 'datePlan'
  },
  props: {
    datePlan: String
  },
  data: () => ({
    dateMenu: false,
    timeMenu: false
  }),
  computed: {
    dateTime () {
      return this.parseVersionDate(this.datePlan)
    },
    date: {
      get () {
        return this.datePlan.split(' ').shift() || this.defaultPlanDate
      },
      set (date) {
        this.$emit('input', `${date} ${this.time}`)
      }
    },
    time: {
      get () {
        return this.datePlan.split(' ').pop() || '12:00'
      },
      set (time) {
        this.$emit('input', `${this.date} ${time}`)
      }
    },
    checkDate () {
      return this.compareCurrentDate(this.date) ? '' : this.$t('pickers.pastDate')
    }
  }
}
</script>

<style scoped>

  .v-text-field >>> .v-messages__message {
    padding-left: 2.5em;
    color: blue;
  }

</style>
