<template>
  <v-container ma-0 pa-0 pt-3>
    <v-toolbar color="pink" dark :dense="$vuetify.breakpoint.smAndDown">
      <v-toolbar-title>Нормы обслуживания</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-text-field
        v-if="$vuetify.breakpoint.mdAndUp"
        v-model="search"
        append-icon="search"
        label="Поиск"
        single-line
        hide-details
      ></v-text-field>
    </v-toolbar>
    <eam-base-table
      :query="query"
      :queryName="queryName"
      searchPath="techRouteDesignation"
      :headers="headers"
      :search="search"
      :constantFilter="filter"
      :constantOrderBy="[{ path: 'id', descending: true }]"
    >
      <template slot="row" slot-scope="props">
        <td>
          <eam-wr-repair-type-card :item="props.item.repairType" />
        </td>
        <td>
          <eam-wr-direction-simple-card :item="props.item.direction" />
        </td>
        <td>
          <eam-model-simple-card :item="props.item.resource" />
        </td>
        <td>{{ props.item.techRouteDesignation }}</td>
        <td class="text-xs-right">{{ props.item.periodicity }} мес</td>
        <td class="text-xs-right">{{ props.item.duration }} д</td>
      </template>
    </eam-base-table>
  </v-container>
</template>

<script>
import { ALL_MAINTENANCE_NORMS } from '@/api/eam-queries'
import * as moment from 'moment'

export default {
  name: 'eam-norms-table',
  props: {
    constantFilter: Array,
    constantOrderBy: Array
  },
  data() {
    return {
      query: ALL_MAINTENANCE_NORMS,
      queryName: 'maintenanceNormsConnection',
      baseFilter: [{ path: 'isValid', comparison: 'equal', value: 'true' }],
      headers: [
        { text: 'Вид ТО', value: 'repairType.name' },
        { text: 'Направление', value: 'direction.name' },
        { text: 'Модель', value: 'resource.name' },
        { text: 'Карта ремонта', value: 'techRouteDesignation' },
        { text: 'Периодичность', value: 'periodicity', align: 'right' },
        { text: 'Длительность', value: 'duration', align: 'right' }
      ],
      search: ''
    }
  },
  computed: {
    filter() {
      return this.constantFilter
        ? this.baseFilter.concat(this.constantFilter)
        : this.baseFilter
    }
  },
  methods: {
    formatDate(date) {
      return moment(date).format('DD.MM.YYYY HH:mm')
    }
  }
}
</script>

<style>
</style>
