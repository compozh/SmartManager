<template>
  <efficiency-loss-form v-if="item && item.id" :item="item" @complete="save" />
</template>

<script>
import singleEfficiencyLoss from '@/api/efficiency/singleEfficiencyLoss.gql'

export default {
  name: 'efficiency-loss-info-page',
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
          id: this.efficiencyLossId
        }
      },
      update(data) {
        if (data.eam && data.eam.efficiencyLosses && data.eam.efficiencyLosses.length) {
          return data.eam.efficiencyLosses[0]
        } else {
          this.$store.commit('eam/setError', 'Запись не найдена')
          return null
        }
      },
      skip() {
        return !this.efficiencyLossId
      },
      error(e) {
        this.$store.commit('eam/setError', e.message)
      }
    }
  },
  data: () => {
    return {
      item: {},
      query: singleEfficiencyLoss,
      editDialog: false
    }
  },
  computed: {
    efficiencyLossId() {
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
