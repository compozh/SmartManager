<template>
  <v-container ma-0 pa-0 pt-3>
    <v-toolbar color="orange" dark :dense="$vuetify.breakpoint.smAndDown">
      <v-toolbar-title>Параметры состояния</v-toolbar-title>
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
      searchPath="name"
      :headers="headers"
      :search="search"
      :constantFilter="filter"
      :constantOrderBy="[{ path: 'id', descending: true }]"
    >
      <template slot="row" slot-scope="props">
        <td>{{ props.item.name }}</td>
        <td>
          <eam-parameter-type-simple-card :item="props.item.conditionParameterType" />
        </td>
        <td>{{ props.item.measurementUnit ? props.item.measurementUnit.name : '' }}</td>
        <td class="text-xs-right">{{ props.item.minValue }}</td>
        <td class="text-xs-right">{{ props.item.maxValue }}</td>
        <td class="text-xs-right">{{ props.item.period }} д</td>
      </template>
    </eam-base-table>
  </v-container>
</template>

<script>
import allConditionParameters from '@/api/conditionParameters/allConditionParameters.gql'
import * as moment from 'moment'

export default {
  name: 'eam-condition-parameters-table',
  props: {
    constantFilter: Array,
    constantOrderBy: Array
  },
  data() {
    return {
      query: allConditionParameters,
      queryName: 'conditionParametersConnection',
      baseFilter: [{ path: 'isValid', comparison: 'equal', value: 'true' }],
      headers: [
        { text: 'Наименование', value: 'name' },
        { text: 'Вид контроля', value: 'conditionParameterType.name' },
        { text: 'ЕИ', value: 'measurementUnit.name' },
        { text: 'Мин.знач.', value: 'minValue', align: 'right' },
        { text: 'Макс.знач.', value: 'maxValue', align: 'right' },
        { text: 'Периодичность контроля', value: 'period', align: 'right' }
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
