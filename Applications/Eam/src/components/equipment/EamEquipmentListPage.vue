<template>
  <eam-base-list-page :query="query" queryName="equipmentsConnection" isElasticSearch>
    <eam-equipment-card slot="card" slot-scope="props" :equipment="props.item" />
  </eam-base-list-page>
</template>

<script>
import allEquipment from '@/api/equipment/allEquipment.gql'

export default {
  name: 'eam-equipment-list-page',
  data() {
    return {
      query: allEquipment
    }
  }
}
</script>

<style>
</style>
