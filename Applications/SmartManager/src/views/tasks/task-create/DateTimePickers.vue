<template>
  <div class="d-flex" :value="dateplan">
    <!-- DATE PICKER -->
    <v-menu ref="datePicker"
            v-model="dateMenu"
            :close-on-content-click="false"
            :return-value.sync="date"
            transition="scale-transition"
            offset-y
            min-width="200px">
      <template v-slot:activator="{ on }">
        <v-text-field :value="formatDate(date)"
                      :label="$t('pickers.date')"
                      solo flat dense
                      readonly
                      v-on="on"
                      style="width: 155px !important;">
          <template #prepend-inner>
            <v-btn v-on="on"
                   text fab x-small
                   dark depressed
                   color="grey" class="mr-2"
                   style="border: 1px dashed;">
              <fa-icon icon="calendar-day" type="fal" size="lg"/>
            </v-btn>
          </template>
        </v-text-field>
      </template>
      <v-date-picker :value="date"
                     @input="inputDate"
                     first-day-of-week="1"
                     no-title
                     scrollable>
        <v-spacer></v-spacer>
        <v-btn text color="primary"
               @click="dateMenu = false">
          {{ $t('buttons.cancel') }}</v-btn>
        <v-btn text color="primary"
               @click="$refs.datePicker.save(date)">OK</v-btn>
      </v-date-picker>
    </v-menu>
    <v-spacer></v-spacer>
    <v-menu ref="timePicker"
            v-model="timeMenu"
            :close-on-content-click="false"
            :nudge-right="40"
            :return-value.sync="time"
            transition="scale-transition"
            offset-y
            max-width="250px"
            min-width="250px">
      <template v-slot:activator="{ on }">
        <v-text-field v-model="time"
                      :label="$t('pickers.time')"
                      solo flat dense
                      readonly
                      v-on="on"
                      style="width: 80px !important;">
        </v-text-field>
      </template>
      <v-time-picker v-model="time"
                     no-title full-width
                     scrollable
                     format="24hr"
                    @click:minute="$refs.timePicker.save(time)"
      ></v-time-picker>
    </v-menu>
  </div>
</template>

<script>
import moment from 'moment'
import { date } from '@/mixins/dateTime'

export default {
  name: 'DateTimePickers',
  mixins: [date],
  data () {
    return {
      time: '12:00',
      date: moment().add(1, 'days').format('YYYY-MM-DD'),
      dateMenu: false,
      timeMenu: false
    }
  },
  computed: {
    dateplan () {
      const formatDate = this.parseDate(this.date)
        .format('YYYY-MM-DD')
      return `${formatDate} ${this.time}`
    }
  },
  methods: {
    inputDate (value) {
      this.date = value
      this.$emit('inputDate', this.dateplan)
    }
  }
}
</script>

<style scoped>

</style>
