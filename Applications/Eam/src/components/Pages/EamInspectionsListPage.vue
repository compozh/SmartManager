<template>
  <v-layout column>
    <v-toolbar class="mb-2" color="cyan" dark flat height="70">
      <!-- <v-toolbar-title>{{ $t('$vuetify.Inspections.caption') }}</v-toolbar-title> -->
      <v-spacer></v-spacer>
      <eam-date-picker v-model="selectedDate"></eam-date-picker>
    </v-toolbar>

    <eam-base-list-page
      :query="query"
      :additionalVariables="additionalVariables"
      :queryName="queryName"
      searchPath="description"
      :constantOrderBy="constantOrderBy"
      :constantFilter="filter"
      groupingPath="technicalPlace"
      isElasticSearch
    >
      <eam-inspection-card slot="card" slot-scope="props" :item="props.item" />
      <v-toolbar slot="groupcard" slot-scope="props" color="#DCEDC8" flat dense="" height="30">
        <eam-techplace-simple-card :item="props.item" />
      </v-toolbar>
    </eam-base-list-page>
  </v-layout>
</template>

<script>
import { ALL_INSPECTIONS } from '@/api/eam-queries.js'
import { ALL_INSPECTIONS_BYEQUIPMENT } from '@/api/eam-queries.js'

import moment from 'moment'

export default {
  name: 'eam-inspections-list-page',
  props: {
    equipmentId: String
  },
  data() {
    return {
      constantOrderBy: [{ path: 'technicalPlaceId' }, { path: 'date' }],
      selectedDate: moment().format('YYYY-MM-DD')
    }
  },
  computed: {
    equipmentIdValue() {
      return this.equipmentId
        ? this.equipmentId
        : this.$route.params.equipmentId
    },
    query() {
      return this.equipmentIdValue
        ? ALL_INSPECTIONS_BYEQUIPMENT
        : ALL_INSPECTIONS
    },
    queryName() {
      return this.equipmentIdValue
        ? 'conditionParameterByEquipmentValuesConnection'
        : 'conditionParameterValuesConnection'
    },
    additionalVariables() {
      return this.equipmentIdValue ? { equipmentId: this.equipmentIdValue } : {}
    },
    filter() {
      return [
        {
          path: 'date',
          comparison: 'greaterThanOrEqual',
          value: this.selectedDate
        },
        {
          path: 'date',
          comparison: 'lessThan',
          value: moment(this.selectedDate)
            .add(1, 'day')
            .format('YYYY-MM-DD')
        }
      ]
    }
  }
}
</script>

<style>
</style>
