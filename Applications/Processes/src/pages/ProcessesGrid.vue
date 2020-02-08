<template>
  <v-flex>
    <v-card-title>
      {{$t('processes.labels.processes')}}
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="search"
        :label="$t('processes.placeholders.Search')"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-data-table
      class="processes-table"
      :loading="loadingProcesses"
      :loading-text="$t('processes.placeholders.LoadingDataText')"
      :headers="headers"
      :items="processes"
      :search="search"
      @click:row="onRowClick"
      :no-data-text="$t('processes.placeholders.NoDataText')"
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
        { text: this.$t('processes.columns.name'), value: 'name' },
        { text: this.$t('processes.columns.version'), value: 'version' }
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
  },
  methods: {
    onRowClick (item) {
      this.$router.push(item.id)
    }
  }
}
</script>
<style>
  .processes-table tr {
    cursor: pointer !important;
  }
</style>
