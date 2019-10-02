<template>
  <v-flex xs12 md6 pa-1>
    <v-hover>
      <v-card slot-scope="{ hover }" :class="`elevation-${hover ? 7 : 2} subheading`" height="100%">
        <v-card-title class="py-2">
          <v-icon :color="item.workRequestCategoryId === '4' ? 'green' : 'red'">{{sourceIcon}}</v-icon>
          <span class="pr-1">{{dateText + ' - '}}</span>
          <span>{{statusCaption}}</span>
          <v-spacer></v-spacer>
          <span>{{item.id}}</span>
        </v-card-title>
        <v-card-text>
          <v-layout fill-height mb-2>
            <span class="subheading font-weight-bold">{{item.content}}</span>
          </v-layout>
          <v-layout wrap justify-space-between>
            <eam-department-simple-card :item="item.department" />
            <eam-techplace-simple-card :item="item.technicalPlace" />
            <eam-equipment-simple-card :item="item.equipment" />
          </v-layout>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-layout wrap justify-space-between>
            <eam-employee-simple-card :item="item.declarerEmployee" />
            <eam-employee-simple-card
              :item="item.responsibleEmployee"
              icon="how_to_reg"
              color="blue"
            />
            <eam-employee-simple-card
              :item="item.performerEmployee"
              icon="directions_run"
              color="green"
            />
          </v-layout>
        </v-card-actions>
      </v-card>
    </v-hover>
  </v-flex>
</template>

<script>
import { sourceIcon, statusCaption } from '@/helpers/work-requests'
import * as moment from 'moment'

export default {
  name: 'eam-work-request-card',
  props: {
    item: Object
  },
  computed: {
    sourceIcon() {
      return sourceIcon(this.item.source)
    },
    statusCaption() {
      return statusCaption(this.item.status)
    },
    dateText() {
      return moment(this.item.creationDate).format('DD.MM.YYYY HH:mm')
    }
  }
}
</script>

<style scoped>
.v-card__title {
  background-color: rgb(232, 253, 158);
}
</style>
