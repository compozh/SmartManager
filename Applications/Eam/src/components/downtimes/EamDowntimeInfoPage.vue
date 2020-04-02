<template>
  <v-container :class="{'ma-0 pa-1': $vuetify.breakpoint.xs}">
    <eam-downtime-info-card :item="item" />
    <eam-downtime-form v-if="item && item.id" :item="item" @complete="save" />
  </v-container>
</template>

<script>
import singleDowntime from '@/api/downtimes/singleDowntime.gql'

export default {
  name: 'eam-downtime-info-page',
  props: {
    id: Number
  },
  apollo: {
    item: {
      query() {
        return this.query
      },
      variables() {
        return {
          id: this.downtimeId
        }
      },
      update(data) {
        const queryData = data[Object.keys(data)[0]]
        if (queryData && queryData.downTimes && queryData.downTimes.length) {
          return queryData.downTimes[0]
        } else {
          this.$store.commit('eam/setError', 'Простой не найден')
          return null
        }
      },
      skip() {
        return !this.downtimeId
      },
      error(e) {
        this.$store.commit('eam/setError', e.message)
      }
    }
  },
  data: () => {
    return {
      item: {},
      query: singleDowntime,
      editDialog: false
    }
  },
  computed: {
    downtimeId() {
      return this.id ? this.id : this.$route.params.id
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
  methods: {
    save() {
      if (this.$apollo.queries.item) {
        this.$apollo.queries.item.refetch()
      }
    }
  }
}
</script>

<style scoped>
</style>
