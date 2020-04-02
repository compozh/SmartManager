<template>
  <eam-base-list-page
    :query="query"
    queryName="efficiencyLossesConnection"
    :constantOrderBy="[{path:'startTime', descending:true}]"
    searchPath="workCenter.name"
    updateEventName="efficiencyLossChanged"
    schema="oee"
  >
    <efficiency-loss-card slot="card" slot-scope="props" :item="props.item" />
  </eam-base-list-page>
</template>

<script>
import allEfficiencyLosses from '@/api/efficiency/allEfficiencyLosses.gql'
import unclassifiedEfficiencyLosses from '@/api/efficiency/allEfficiencyLosses.gql'

export default {
  name: 'efficiency-loss-list-page',
  data() {
    return {
      query: allEfficiencyLosses,
      unclassifiedQuery: unclassifiedEfficiencyLosses
    }
  }
}
</script>

<style>
</style>
