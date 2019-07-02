<template>
  <eam-base-list-page :query="query" :queryName="queryName" searchPath="content" groupingPath="technicalPlace">
    <eam-work-request-card slot="card" slot-scope="props" :item="props.item"/>
    <eam-techplace-simple-card slot="groupcard" slot-scope="props" :item="props.item"/>
  </eam-base-list-page>
</template>

<script>
import { ALL_WORK_REQUESTS } from "../api/eam-queries.js";

export default {
  name: "eam-work-requests-list-page",  
  data() {
    return {
      query: ALL_WORK_REQUESTS,
      queryName: 'workRequestConnection'
    };
  }
};
</script>

<style>
</style>
