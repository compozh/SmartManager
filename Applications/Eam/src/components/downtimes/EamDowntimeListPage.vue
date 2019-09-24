<template>
  <eam-base-list-page :query="query" queryName="downTimesConnection" isElasticSearch updateEventName="downTimeChanged">
    <eam-downtime-card slot="card" slot-scope="props" :item="props.item" />
  </eam-base-list-page>
</template>

<script>
import allDowntimes from '@/api/downtimes/allDowntimes.gql'

export default {
  name: 'eam-downtime-list-page',
  data() {
    return {
      query: allDowntimes
    }
  }
}
</script>

<style>
</style>
