<template>
  <v-container ma-0 pa-0 pt-3>
    <v-toolbar color="#4caf50" dark :dense="$vuetify.breakpoint.smAndDown">
      <v-toolbar-title>Осмотры</v-toolbar-title>
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
      searchPath="conditionParameter.name"
      :headers="headers"
      :search="search"
      :constantFilter="filter"
      :constantOrderBy="[{ path: 'id', descending: true }]"
    >
      <template slot="row" slot-scope="props">
        <td>
          <v-icon :color="getIcon(props.item).color">{{ getIcon(props.item).icon }}</v-icon>
        </td>
        <td>{{ props.item.conditionParameter.name }}</td>
        <td>{{ formatDate(props.item.date) }}</td>
        <td class="text-xs-right">{{ props.item.value }}</td>
        <td>{{ props.item.conditionParameter.measurementUnit.name }}</td>
      </template>
    </eam-base-table>
  </v-container>
</template>

<script>
import { ALL_INSPECTIONS } from '@/api/eam-queries'
import * as moment from 'moment'
import * as inspectionsHelper from '../helpers/inspections'

export default {
  name: 'eam-inspections-table',
  props: {
    constantFilter: Array,
    constantOrderBy: Array
  },
  data() {
    return {
      query: ALL_INSPECTIONS,
      queryName: 'conditionParameterValuesConnection',
      baseFilter: [{ path: 'value', comparison: 'notEqual', value: '0' }],
      headers: [
        { text: '', value: 'source', align: 'left' },
        { text: 'Параметр', value: 'conditionParameter.name' },
        { text: 'Дата', value: 'date', align: 'left' },
        { text: 'Значение', value: 'value', align: 'right' },
        {
          text: 'ЕИ',
          value: 'conditionParameter.measurementUnit.name',
          align: 'left'
        }
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
    getIcon(item) {
      return inspectionsHelper.getIcon(item)
    },
    formatDate(date) {
      return moment(date).format('DD.MM.YYYY HH:mm')
    }
  }
}
</script>

<style>
</style>
