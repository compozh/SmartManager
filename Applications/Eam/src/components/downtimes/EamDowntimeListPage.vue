<template>
  <v-tabs color="cyan" dark slider-color="yellow">
    <v-tab key="unclassified">Неклассифицированные</v-tab>
    <v-tab key="all">Все</v-tab>
    <v-tabs-items touchless>
      <v-tab-item key="unclassified" lazy>
        <eam-base-list-page
          :query="unclassifiedDownTimesQuery"
          queryName="unclassifiedDownTimesConnection"
          :constantOrderBy="[{path:'date', descending:true}]"
          updateEventName="downTimeChanged"
        >
          <eam-downtime-card slot="card" slot-scope="props" :item="props.item" />
        </eam-base-list-page>
      </v-tab-item>
      <v-tab-item key="all" lazy>
        <eam-base-list-page
          :query="query"
          queryName="downTimesConnection"
          :constantOrderBy="[{path:'date', descending:true}]"
          isElasticSearch
          updateEventName="downTimeChanged"
        >
          <eam-downtime-card slot="card" slot-scope="props" :item="props.item" />
        </eam-base-list-page>
      </v-tab-item>
    </v-tabs-items>
  </v-tabs>
</template>

<script>
import allDowntimes from '@/api/downtimes/allDowntimes.gql'
import unclassifiedDownTimes from '@/api/downtimes/unclassifiedDownTimes.gql'

export default {
  name: 'eam-downtime-list-page',
  data() {
    return {
      query: allDowntimes,
      unclassifiedDownTimesQuery: unclassifiedDownTimes
    }
  }
}
</script>

<style>
</style>
