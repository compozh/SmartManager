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
        if (data.eam && data.eam.downTimes && data.eam.downTimes.length) {
          return data.eam.downTimes[0]
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
