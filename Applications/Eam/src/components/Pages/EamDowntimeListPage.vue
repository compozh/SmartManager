<template>
  <eam-base-list-page :query="query" queryName="downTimesConnection" searchPath="description">
    <eam-downtime-card slot="card" slot-scope="props" :item="props.item"/>
  </eam-base-list-page>
</template>

<script>
import { ALL_DOWNTIME } from '../../api/eam-queries.js';

export default {
  name: 'eam-downtime-list-page',  
  data() {
    return {
      query: ALL_DOWNTIME
    }
  }
}
</script>

<style>
</style>
