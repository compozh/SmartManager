<template>
  <v-data-table
    :headers="headers"
    :items="items"
    :total-items="totalItems"
    :loading="loading"
    :pagination.sync="pagination"
    disable-initial-sort
    class="elevation-1"
  >
    <template v-slot:items="props">
      <slot name="row" :item="props.item"></slot>
    </template>
  </v-data-table>
</template>

<script>
import { eventBus } from '../../main'

export default {
  name: 'eam-base-table',
  props: {
    constantFilter: Array,
    query: Object,
    queryName: String,
    searchPath: String,
    constantOrderBy: Array,
    headers: Array,
    search: String,
    updateEventName: String
  },
  apollo: {
    itemsCon: {
      query() {
        return this.query
      },
      variables() {
        return {
          after: this.itemsAfter,
          first: this.rowsPerPage,
          where: this.where,
          orderBy: this.orderBy
        }
      },
      update(data) {
        return data.eam[this.queryName]
      },
      skip() {
        return !this.rowsPerPage
      },
      error(e) {
        this.$store.commit('eam/setError', e.message)
      }
    }
  },
  data() {
    return {
      itemsCon: {},
      pagination: {},
      orderById: [{ path: 'id' }]
    }
  },
  computed: {
    where() {
      const filters = this.constantFilter ? this.constantFilter : []
      if (this.search) {
        return [
          ...filters,
          {
            path: this.searchPath ? this.searchPath : 'name',
            comparison: 'like',
            value: `%${this.search}%`
          }
        ]
      }
      return filters
    },
    orderBy() {
      return this.pagination && this.pagination.sortBy
        ? [
          {
            path: this.pagination.sortBy,
            descending: this.pagination.descending
          }
        ]
        : this.constantOrderBy
          ? this.constantOrderBy
          : this.orderById
    },
    items() {
      return this.itemsCon && this.itemsCon.edges
        ? this.itemsCon.edges.map(i => i.node)
        : []
    },
    totalItems() {
      return this.itemsCon && this.itemsCon.totalCount
        ? this.itemsCon.totalCount
        : 0
    },
    rowsPerPage() {
      return this.pagination && this.pagination.rowsPerPage
        ? this.pagination.rowsPerPage > 0
          ? this.pagination.rowsPerPage
          : 3000
        : null
    },
    itemsAfter() {
      return this.pagination && this.pagination.page && this.pagination.page > 1
        ? (
          (this.pagination.page - 1) * this.pagination.rowsPerPage -
            1
        ).toString()
        : null
    },
    loading() {
      return this.$store.getters['eam/loading']
    }
  },
  watch: {
    '$apollo.loading'(value) {
      this.$store.commit('eam/setLoading', value)
    }
  },
  created() {
    if (this.updateEventName) {
      const vm = this
      eventBus.$on(this.updateEventName, () => {
        if (vm.$apollo.queries.itemsCon) {
          vm.$apollo.queries.itemsCon.refetch()
        }
      })
    }
  },
  beforeDestroy() {
    if (this.updateEventName) {
      eventBus.$off(this.updateEventName)
    }
  }
}
</script>

<style>
</style>
