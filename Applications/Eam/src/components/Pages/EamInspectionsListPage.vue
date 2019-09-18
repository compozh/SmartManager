<template>
  <eam-base-list-page
    :query="query"
    queryName="conditionParameterValuesConnection"
    searchPath="description"
    :constantOrderBy="constantOrderBy"
    groupingPath="technicalPlace"
    isElasticSearch
  >
    <eam-inspection-card slot="card" slot-scope="props" :item="props.item" />
    <eam-techplace-simple-card slot="groupcard" slot-scope="props" :item="props.item" />
  </eam-base-list-page>
</template>

<script>
import { ALL_INSPECTIONS } from '../../api/eam-queries.js'

export default {
  name: 'eam-inspections-list-page',
  data() {
    return {
      query: ALL_INSPECTIONS,
      constantOrderBy: [
        { path: 'technicalPlaceId' },
        { path: 'date', descending: true }
      ]
    }
  }
}
</script>

<style>
</style>
