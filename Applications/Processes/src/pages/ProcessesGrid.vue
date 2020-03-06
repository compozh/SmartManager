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
  created () {
    this.loadingProcesses = true
    this.$store.dispatch('getProcesses').then(result => {
      this.loadingProcesses = false
      if (result) {
        this.$store.commit('setProcesses', result.processes)
      } else {
        this.$store.commit('setSnackbarErrorMessage', this.$t('processes.errors.processesErrorLoad'))
      }
    })
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
