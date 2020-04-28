<template>
  <div class="d-flex">
    <!-- DATE PICKER -->
    <v-menu ref="datePicker"
            v-model="datePicker"
            :close-on-content-click="false"
            :return-value.sync="date"
            transition="scale-transition"
            offset-y
            min-width="290px">
      <template v-slot:activator="{ on }">
        <v-text-field v-model="date"
                      :label="$t('pickers.date')"
                      readonly
                      v-on="on">
          <template #prepend-inner>
            <fa-icon class="mr-2 primary--text"
                     icon="calendar-day"/>
          </template>
        </v-text-field>
      </template>
      <v-date-picker v-model="date" no-title scrollable>
        <v-spacer></v-spacer>
        <v-btn text color="primary" @click="menu = false">Cancel</v-btn>
        <v-btn text color="primary" @click="$refs.menu.save(date)">OK</v-btn>
      </v-date-picker>
    </v-menu>
    <v-spacer></v-spacer>
    <v-menu ref="timePicker"
            v-model="timePicker"
            :close-on-content-click="false"
            :nudge-right="40"
            :return-value.sync="time"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="290px">
      <template v-slot:activator="{ on }">
        <v-text-field v-model="time"
                      :label="$t('pickers.time')"
                      readonly
                      v-on="on">
          <template #prepend-inner>
            <fa-icon class="mr-2 primary--text"
                     icon="alarm-clock"/>
          </template>
        </v-text-field>
      </template>
      <v-time-picker v-model="time"
                    no-title full-width
                    @click:minute="$refs.menu.save(time)"
      ></v-time-picker>
    </v-menu>
  </div>
</template>

<script>
export default {
  name: 'DateTimePickers',
  data: () => ({
    date: '',
    time: '',
    datePicker: false,
    timePicker: false
  })
}
</script>

<style scoped>

</style>
