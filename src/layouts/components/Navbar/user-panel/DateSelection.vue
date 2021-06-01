<template>
  <v-dialog :value="dateSelectionDialog"
            @input="$emit('input', $event)"
            max-width="600" persistent>
    <v-card>
      <v-card-text class="d-flex pt-10">
        <v-menu :close-on-content-click="false"
                transition="scale-transition"
                offset-y min-width="200px">
          <template #activator="{ on }">
            <v-text-field v-on="on"
                          :value="formatDate(dateStart)"
                          :label="$t('pickers.dateFrom')"
                          readonly hide-details
                          outlined dense
                          :class="`body-2 ${mr}-5`"/>
          </template>
          <v-date-picker v-model="dateStart"
                         :min="formatPickerDate(currentDate)"
                         first-day-of-week="1"
                         scrollable/>
        </v-menu>
        <v-menu :close-on-content-click="false"
                transition="scale-transition"
                offset-y min-width="200px">
          <template #activator="{ on }">
            <v-text-field v-on="on"
                          :value="formatDate(dateEnd)"
                          :label="$t('pickers.dateTo')"
                          :disabled="noTimeLimit"
                          readonly hide-details
                          outlined dense
                          class="body-2"/>
          </template>
          <v-date-picker v-model="dateEnd"
                         :min="defaultPlanDate"
                         first-day-of-week="1"
                         scrollable/>
        </v-menu>
      </v-card-text>
      <v-card-actions class="pa-6 pt-0">
        <v-checkbox v-model="noTimeLimit"
                    :label="$t('pickers.noTimeLimit')"/>
        <v-spacer/>
        <outlined-btn x-small
                      color="blue-grey"
                      icon="times"
                      :handler="() => closeDialog()">
          <span>{{ $t('buttons.cancel') }}</span>
        </outlined-btn>
        <outlined-btn x-small
                      color="success"
                      icon="user-plus"
                      :handler="() => addDelegateUser()">
          <span>{{ $t('buttons.delegate') }}</span>
        </outlined-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import OutlinedBtn from '@/components/OutlinedBtn'
import { date } from '@/mixins/dateTime'

export default {
  name: 'DateSelection',
  mixins: [date],
  model: {
    prop: 'dateSelectionDialog'
  },
  props: ['dateSelectionDialog', 'userId'],
  components: {
    OutlinedBtn
  },
  data: () => ({
    dateFrom: '',
    dateTo: '',
    noTimeLimit: false
  }),
  computed: {
    dateStart: {
      get () {
        return this.formatPickerDate(this.dateFrom)
      },
      set (date) {
        this.dateFrom = this.parsePickerDate(date)
      }
    },
    dateEnd: {
      get () {
        return this.formatPickerDate(this.dateTo)
      },
      set (date) {
        this.dateTo = this.parsePickerDate(date)
      }
    }
  },
  created () {
    this.initDates()
  },
  methods: {
    initDates () {
      this.dateFrom = this.currentDate
      this.dateTo = this.delegationDateEnd
    },
    async addDelegateUser () {
      const result = await this.$store.dispatch('addDelegateUser', {
        userId: this.userId,
        dateFrom: this.formatDateTime(this.dateFrom),
        dateTo: this.noTimeLimit
          ? '9999-12-31 23:59'
          : this.formatDateTime(this.dateTo)
      })
      !result || this.closeDialog()
    },
    closeDialog () {
      this.initDates()
      this.$emit('input', false)
    }
  }
}
</script>

<style scoped>

</style>
