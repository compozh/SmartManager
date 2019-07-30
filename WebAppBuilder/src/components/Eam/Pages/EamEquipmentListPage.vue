<template>
  <eam-base-list-page :query="query" queryName="equipmentsConnection" isElasticSearch>
    <eam-equipment-card slot="card" slot-scope="props" :equipment="props.item" />
  </eam-base-list-page>
</template>

<script>
import { ALL_EQUIPMENT } from '../api/eam-queries.js'

export default {
  name: 'eam-equipment-list-page',
  data() {
    return {
      query: ALL_EQUIPMENT
    }
  }
}
</script>

<style>
</style>
