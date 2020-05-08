<template>
  <v-row no-gutters>
    <v-col>
      <div class="page-header">
        <span class="page-title">{{ this.$t('processes.runProcess') }}</span>
         <v-text-field
          v-model="search"
          append-icon="fa-search"
          :label="this.$t('search')"
          class="data-search"
          single-line
          hide-details
        ></v-text-field>
      </div>
      <v-data-table
        :headers="headers"
        :items="processes"
        :items-per-page="10"
        :search="search"
         @click:row="onRowClick"
        class="elevation-1 body-2"
        style="font-size: 10px"
      ></v-data-table>
    </v-col>
  </v-row>
</template>

<script>
import { zones, processes } from '@/mixins/units'

export default {
  name: 'TaskList',
  mixins: [zones, processes],
  data () {
    return {
      search: '',
      headers: [
        { text: this.$t('processes.name'), value: 'name' },
        { text: this.$t('processes.version'), value: 'procDefId' }
      ]
    }
  },
  created () {
    this.getProcesses()
  },
  methods: {
    onRowClick (item) {
      const itemId = item.procDefId
      this.$router.push({ path: 'process', query: { processId: itemId } })
    }
  }
}
</script>

<style scoped>
  .page-header {
    display: flex;
    justify-content: space-between;
    height: 60px;
    align-items: center;
    padding: 0 10px;
  }
  .page-title {
    font-size: 28px;
  }
  .data-search {
    margin: 0;
    padding: 0;
    max-width: 500px;
  }
</style>
