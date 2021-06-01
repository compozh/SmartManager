<template>
  <v-dialog :value="rightsEditDialog"
            @input="$emit('input', $event)"
            max-width="600" persistent>
    <v-card>
      <v-card-text class="d-flex flex-column pt-10 mb-5">
        <div class="d-flex mb-5">
          <v-menu :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y min-width="200px">
            <template #activator="{ on }">
              <v-text-field v-on="on"
                            :value="formatDate(dateFrom)"
                            :label="$t('pickers.dateFrom')"
                            readonly hide-details
                            outlined dense
                            :class="`body-2 ${mr}-5`"/>
            </template>
            <v-date-picker v-model="dateStart"
                           :max="dateEnd"
                           first-day-of-week="1"
                           scrollable/>
          </v-menu>
          <v-menu :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y min-width="200px">
            <template #activator="{ on }">
              <v-text-field v-on="on"
                            :value="formatDate(dateTo)"
                            :label="$t('pickers.dateTo')"
                            readonly hide-details
                            outlined dense
                            class="body-2"/>
            </template>
            <v-date-picker v-model="dateEnd"
                           :min="dateStart"
                           first-day-of-week="1"
                           scrollable/>
          </v-menu>
        </div>
        <v-text-field v-model="comm"
                      clearable
                      clear-icon="+"
                      :label="$t('notes.comment')"
                      hide-details
                      class="body-2"/>
      </v-card-text>
      <v-card-actions class="pa-6 pt-0">
        <v-spacer/>
        <outlined-btn x-small
                      color="blue-grey"
                      icon="times"
                      :handler="() => closeDialog()">
          <span>{{ $t('buttons.cancel') }}</span>
        </outlined-btn>
        <outlined-btn x-small
                      color="success"
                      icon="check"
                      :handler="() => editRights()">
          <span>{{ $t('buttons.save') }}</span>
        </outlined-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import OutlinedBtn from '@/components/OutlinedBtn'
import { date } from '@/mixins/dateTime'

export default {
  name: 'DelegationEdit',
  mixins: [date],
  model: {
    prop: 'rightsEditDialog'
  },
  props: ['rightsEditDialog', 'rights'],
  components: {
    OutlinedBtn
  },
  data: () => ({
    dateFrom: '',
    dateTo: '',
    comm: ''
  }),
  computed: {
    dateStart: {
      get () {
        return this.dateFrom
          ? this.formatPickerDate(this.dateFrom)
          : this.dateFrom
      },
      set (date) {
        this.dateFrom = this.parsePickerDate(date)
      }
    },
    dateEnd: {
      get () {
        return this.dateTo
          ? this.formatPickerDate(this.dateTo)
          : this.dateTo
      },
      set (date) {
        this.dateTo = this.parsePickerDate(date)
      }
    }
  },
  watch: {
    rights () {
      this.dateFrom = this.parseTimeStamp(this.rights.DATEFROM)
      this.dateTo = this.parseTimeStamp(this.rights.DATETO)
      this.comm = this.rights.COMM
    }
  },
  methods: {
    async editRights () {
      const result = await this.$store.dispatch('editDelegatedRights', {
        mode: 'EDIT',
        id: this.rights.ID,
        dateFrom: this.formatPickerDate(this.dateFrom),
        dateTo: this.formatPickerDate(this.dateTo),
        comm: this.comm
      })
      !result || this.closeDialog()
    },
    closeDialog () {
      this.$emit('input', false)
    }
  }
}
</script>

<style scoped>

  .v-input >>> .v-input__append-inner > div > button {
    transform: rotate(45deg);
    font-size: 30px;
    user-select: none;
    margin-top: 0.1em;
  }

</style>
