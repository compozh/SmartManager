<template>
  <v-layout v-if="items" column>
    <v-layout v-if="!items.length" justify-center>
      <span>Елементы не найдены</span>
    </v-layout>
    <v-layout v-else-if="!groupingPath" wrap>
      <slot v-for="item in items" name="card" :item="item"></slot>
    </v-layout>
    <v-layout v-else column>
      <v-layout v-for="groupedItem in groupedItems" :key="groupedItem.id" column>
        <slot name="groupcard" :item="groupedItem"></slot>
        <v-layout wrap>
          <slot
            v-for="item in items.filter(i => i[groupingPath] && i[groupingPath].id == groupedItem.id)"
            name="card"
            :item="item"
          ></slot>
        </v-layout>
      </v-layout>
    </v-layout>
  </v-layout>
</template>

<script>
import { eventBus } from '@/main'

const initialRowsPerFetch = 25

export default {
  name: 'eam-base-list-page',
  props: {
    constantFilter: Array,
    query: Object,
    queryName: String,
    searchPath: String,
    constantOrderBy: Array,
    groupingPath: String,
    isElasticSearch: Boolean,
    additionalVariables: Object,
    updateEventName: String
  },
  apollo: {
    itemsCon: {
      query() {
        return this.query
      },
      variables() {
        return {
          ...this.additionalVariables,
          after: null,
          first: initialRowsPerFetch,
          where: this.where,
          orderBy: this.orderBy,
          search: this.isElasticSearch ? this.search : null
        }
      },
      update(data) {
        return data.eam[this.queryName]
      },
      error(e) {        
        this.$store.commit('eam/setError', e.message)
      }
    }
  },
  data() {
    return {
      itemsCon: {},
      rowsPerFetch: initialRowsPerFetch,
      orderById: [{ path: 'id' }]
    }
  },
  computed: {
    where() {
      const filters = this.constantFilter ? this.constantFilter : []
      if (this.search && !this.isElasticSearch) {
        filters.push({
          path: this.searchPath ? this.searchPath : 'name',
          comparison: 'like',
          value: `%${this.search}%`
        })
      }
      return filters
    },
    orderBy() {
      return this.constantOrderBy ? this.constantOrderBy : this.orderById
    },
    search() {
      return this.$store.getters['eam/search']
    },
    items() {
      return this.itemsCon && this.itemsCon.edges
        ? this.itemsCon.edges.map(i => i.node)
        : []
    },
    itemsAfter() {
      return this.itemsCon && this.itemsCon.pageInfo
        ? this.itemsCon.pageInfo.endCursor
        : null
    },
    groupedItems() {
      if (!this.items) {
        return []
      }
      const groupingPath = this.groupingPath
      return this.items
        .map(item => {
          return item[groupingPath] ? item[groupingPath] : { id: 'none' }
        })
        .filter(function(value, index, self) {
          return (
            self.findIndex(val => {
              return val.id == value.id
            }) === index
          )
        })
    }
  },
  watch: {
    '$apollo.loading'(value) {
      this.$store.commit('eam/setLoading', value)
    }
  },
  methods: {
    fetchOnScroll() {
      if (
        this.itemsCon &&
        this.itemsCon.pageInfo &&
        this.itemsCon.pageInfo.hasNextPage
      ) {
        this.$apollo.queries.itemsCon.fetchMore({
          variables: {
            after: this.itemsAfter,
            first: this.rowsPerFetch,
            where: this.where,
            orderBy: this.orderBy,
            search: this.isElasticSearch ? this.search : null
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            const newEdges = fetchMoreResult.eam[this.queryName].edges
            const pageInfo = fetchMoreResult.eam[this.queryName].pageInfo
            const totalCount = fetchMoreResult.eam[this.queryName].totalCount

            const res = {
              __typename: previousResult.eam.__typename
            }
            res[this.queryName] = {
              __typename: previousResult.eam[this.queryName].__typename,
              edges: [...previousResult.eam[this.queryName].edges, ...newEdges],
              totalCount,
              pageInfo
            }
            return {
              eam: res
            }
          }
        })
        if (this.rowsPerFetch < 500) {
          this.rowsPerFetch *= 2
        }
      }
    },
    onScroll() {      
      let bottomOfWindow =
        document.documentElement.scrollTop + window.innerHeight >
        0.8 * document.documentElement.offsetHeight

      if (bottomOfWindow && !this.$apollo.loading) {
        this.fetchOnScroll()
      }
    }
  },
  mounted() {    
    window.addEventListener('scroll', this.onScroll, false)
  },
  destroyed() {    
    window.removeEventListener('scroll', this.onScroll, false)
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
