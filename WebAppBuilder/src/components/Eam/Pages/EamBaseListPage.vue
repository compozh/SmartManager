<template>
  <v-layout v-if="itemsCon">
    <v-layout v-if="!groupingPath">
      <v-layout column v-for="item in items" :key="item.id">
        <slot name="card" slot="item" slot-scope="props" :item="props.item"></slot>
      </v-layout>
    </v-layout>
    <v-data-iterator
      v-if="groupingPath"
      :items="groupedItems"
      :pagination="pagination"
      total-items="-1"
      content-tag="v-layout"
      hide-actions
      wrap
    >
      <slot name="card" slot="groupedItem" slot-scope="props" :item="props.item"></slot>
    </v-data-iterator>
  </v-layout>
</template>

<script>
export default {
  name: "eam-base-list-page",
  props: {
    constantFilter: Array,
    query: Object,
    queryName: String,
    searchPath: String,
    constantOrderBy: Array,
    groupingPath: String
  },
  apollo: {
    itemsCon: {
      query() {
        return this.query;
      },
      variables() {
        return {
          after: this.itemsAfter,
          first: this.rowsPerPage,
          where: this.where,
          orderBy: this.orderBy
        };
      },
      update(data) {
        return data.eam[this.queryName];
      }
    }
  },
  data() {
    return {
      itemsCon: {},
      rowsPerPage: 30
    };
  },
  computed: {
    pagination() {
      return { rowsPerPage: -1, page: 1 };
    },
    where() {
      const filters = this.constantFilter ? this.constantFilter : [];
      if (this.search) {
        filters.push({
          path: this.searchPath ? this.searchPath : "name",
          comparison: "like",
          value: `%${this.search}%`
        });
      }
      return filters;
    },
    orderBy() {
      return this.constantOrderBy ? this.constantOrderBy : [];
    },
    search() {
      return this.$store.getters["eam/search"];
    },
    items() {
      return this.itemsCon.edges;
    },
    groupedItems() {
      return this.items
        .map(item => {
          return item[this.groupingPath];
        })
        .filter(function(value, index, self) {
          return (
            self.findIndex(val => {
              return val.id == value.id;
            }) === index
          );
        });
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
            first: this.rowsPerPage,
            where: this.where,
            orderBy: this.orderBy
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            const newEdges = fetchMoreResult.eam[this.queryName].edges;
            const pageInfo = fetchMoreResult.eam[this.queryName].pageInfo;
            const totalCount = fetchMoreResult.eam[this.queryName].totalCount;

            const res = {
              __typename: previousResult.eam.__typename
            };
            res[this.queryName] = {
              __typename: previousResult.eam[this.queryName].__typename,
              edges: [...previousResult.eam[this.queryName].edges, ...newEdges],
              totalCount,
              pageInfo
            };
            return {
              eam: res
            };
          }
        });
      }
    }
  },
  mounted() {
    const that = this;
    window.onscroll = () => {
      let bottomOfWindow =
        document.documentElement.scrollTop + window.innerHeight ===
        document.documentElement.offsetHeight;

      if (bottomOfWindow) {
        that.fetchOnScroll();
      }
    };
  }
};
</script>

<style>
</style>
