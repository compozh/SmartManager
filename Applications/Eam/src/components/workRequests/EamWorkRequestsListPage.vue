<template>
  <eam-base-list-page
    :query="query"
    :queryName="queryName"
    searchPath="content"
    :constantOrderBy="[{path:'creationDate', descending:true}]"
    isElasticSearch
  >
    <eam-work-request-card slot="card" slot-scope="props" :item="props.item" />
  </eam-base-list-page>
</template>

<script>
import allWorkRequests from '@/api/workRequests/allWorkRequests.gql'

export default {
  name: 'eam-work-requests-list-page',
  data() {
    return {
      query: allWorkRequests,
      queryName: 'workRequestConnection'
    }
  }
}
</script>

<style>
</style>
