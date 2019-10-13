<template>
  <v-flex xs12 md6 pa-1>
    <v-hover>
      <v-card slot-scope="{ hover }" :class="`elevation-${hover ? 7 : 2} subheading`" height="100%">
        <router-link :to="{ name: 'EAMDOWNTIMEINFO', params: { id: item.id }}">
        <v-card-title class="py-2">
          <v-chip
            v-if="item.additionalData && item.additionalData.isEmergency"
            class="ma-0 mr-2"
            color="red"
            text-color="white"
          >
            <v-avatar left>
              <v-icon>error_outline</v-icon>
            </v-avatar>Аварийный
          </v-chip>
          <v-chip
            v-if="item.additionalData && item.additionalData.isPlanned"
            class="ma-0 mr-2"
            color="green"
            text-color="white"
          >
            <v-avatar left>
              <v-icon>insert_invitation</v-icon>
            </v-avatar>Плановый
          </v-chip>
          <v-icon color="green" class="mr-2">access_time</v-icon>
          <span class="mr-2">{{startDateText}}</span>
          <span class="mr-2">-</span>
          <span class="mr-2">{{endDateText}}</span>
          <v-spacer></v-spacer>
          <span>{{item.id}}</span>
        </v-card-title>
        </router-link>
        <v-card-text>
          <v-layout wrap justify-space-between mb-2>
            <eam-department-simple-card :item="item.department" />
            <eam-techplace-simple-card :item="item.technicalPlace" />
            <eam-equipment-simple-card :item="item.equipment" />
          </v-layout>
          <v-layout align-center wrap justify-space-between>
            <v-chip class="ma-0 mr-3" color="blue" text-color="white" label>{{item.value}} ч</v-chip>
            <span>{{typeName}}</span>
            <v-spacer></v-spacer>
            <eam-employee-simple-card
              v-if="item.additionalData"
              :item="item.additionalData.responsible"
              class="justify-end"
            />
          </v-layout>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions v-if="item.additionalData">
          <v-layout wrap justify-space-between>
            <eam-wr-direction-simple-card :item="item.additionalData.direction" />
            <eam-failure-type-simple-card :item="item.additionalData.failureType" />
            <eam-failure-reason-simple-card :item="item.additionalData.failureReason" />
          </v-layout>
          <v-spacer></v-spacer>
          <v-dialog v-model="editDialog" max-width="700" lazy>
            <template v-slot:activator="{ on }">
              <v-btn icon v-on="on" class="ma-0 ml-1">
                <v-icon color="purple">edit</v-icon>
              </v-btn>
            </template>
            <eam-downtime-form :item="item" @complete="save" />
          </v-dialog>
        </v-card-actions>
      </v-card>
    </v-hover>
  </v-flex>
</template>

<script>
import { typeName } from '@/helpers/downtimes'
import * as moment from 'moment'

export default {
  name: 'eam-downtime-card',
  props: {
    item: Object
  },
  data: () => {
    return {
      editDialog: false
    }
  },
  computed: {
    typeName() {
      if (!this.item.additionalData) {
        return ''
      }
      return typeName(this.item.additionalData.downTimeType)
    },
    startDateText() {
      return moment(this.item.date).format('DD.MM.YYYY HH:mm')
    },
    endDateText() {
      return this.item.endDate
        ? moment(this.item.endDate).format('DD.MM.YYYY HH:mm')
        : '...'
    }
  },
  methods: {
    save() {
      this.editDialog = false
    }
  }
}
</script>

<style scoped>
.v-card__title {
  background-color: rgb(144, 219, 238);
}
a {
  text-decoration: none !important;
}
</style>
