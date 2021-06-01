<template>
  <v-row no-gutters>
    <router-view v-if="$route.name === 'process'" class="flex-grow-1"/>
    <v-col v-else>
      <div class="processes-page-header">
        <span class="processes-page-title">
          {{ this.$t('processes.runProcess') }}
        </span>
         <v-text-field v-model="search"
                       append-icon="fa-search"
                       :label="this.$t('search')"
                       class="processes-search"
                       single-line
                       hide-details/>
      </div>
      <v-data-table :headers="headers"
                    :items="processes"
                    item-key="procDefId"
                    :items-per-page="10"
                    :search="search"
                    @click:row="onRowClick"
                    class="elevation-1 body-2 processes-table"
                    style="font-size: 10px"
                    :footer-props="{itemsPerPageText: $t('processes.perPage')}"/>
    </v-col>
  </v-row>
</template>

<script>
import { zones, processes } from '@/mixins/units'

export default {
  name: 'Processes',
  mixins: [zones, processes],
  data () {
    return {
      search: '',
      headers: [
        { text: this.$t('processes.name'), value: 'processName' },
        { text: this.$t('processes.version'), value: 'procDefId' }
      ]
    }
  },
  created () {
    this.getProcesses()
  },
  methods: {
    onRowClick (item) {
      this.$router.push({
        name: 'process',
        params: {
          processId: item.procDefId,
          name: item.name
        }
      })
    }
  }
}
</script>

<style>

  .processes-page-header {
    display: flex;
    justify-content: space-between;
    height: 60px;
    align-items: center;
    padding: 0 10px;
  }
  .processes-page-title {
    font-size: 28px;
  }
  .processes-search {
    margin: 0;
    padding: 0;
    max-width: 500px;
  }

  .processes-table >>> .v-data-footer {
    font-size: 14px;
  }

  .processes-table tr {
    cursor: pointer !important;
  }

</style>
