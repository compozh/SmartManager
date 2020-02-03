<template>
  <v-flex>
    <v-card-title>
      {{this.$t('processes.labels.processes')}}
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="search"
        :label="this.$t('processes.placeholders.Search')"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-data-table
      :loading="loadingProcesses"
      :headers="headers"
      :items="processes"
      :search="search"
      :no-data-text="this.$t('processes.placeholders.NoDataText')"
      :hide-default-footer="true"
    ></v-data-table>
  </v-flex>
</template>
<script>
export default {
  name: 'processes-grid',
  data () {
    return {
      search: '',
      loadingProcesses: false,
      headers: [
        { text: 'id dsds', value: 'id' },
        { text: 'key', value: 'key' },
        { text: 'category', value: 'category' },
        { text: 'name', value: 'name' },
        { text: 'version', value: 'version' },
        { text: 'resource', value: 'resource' },
        { text: 'deploymentId', value: 'deploymentId' },
        { text: 'diagram', value: 'diagram' },
        { text: 'suspended', value: 'suspended' },
        { text: 'tenantId', value: 'tenantId' }
      ]
    }
  },
  async created () {
    this.loadingProcesses = true
    let res = await this.$store.dispatch('getProcesses')
    this.$store.commit('setProcesses', res.processes)
    this.loadingProcesses = false
  },
  computed: {
    processes () {
      return this.$store.getters['processes']
    }
  }
}
</script>
