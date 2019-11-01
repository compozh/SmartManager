<template>
  <v-layout v-if="workCentersForWorker.length" class="mes-fix-workcenter-layout">
      <span>{{this.$t('mes.labels.SelectWorkCenterToCommit')}}</span>
      <v-flex xs12 sm6 d-flex>
        <v-select
          :items="workCenterItems()"
          label="Рабочий центр"
        ></v-select>
      </v-flex>
      <v-btn class="setup-installations-button" outlined @click="onClickFixWorkCenter" text color="#326DA8">{{this.$t('mes.buttons.Fixate')}}</v-btn>
  </v-layout>
</template>

<script>

export default {
  name: 'mes-fix-workCenter',
  data() {
    return { workCenterToFix: null }
  },
  created() {
    this.initialize()
  },
  computed: {
    workCentersForWorker() {
      return this.$store.getters['mes/workCentersForWorker']
    },
    initialWorkCenter() {
      return this.$store.getters['mes/initialWorkCenter']
    },
    properties() {
      return this.$store.getters['mes/properties']
    }
  },
  methods: {
    workCenterItems() {
      let workCenterItems = []
      for (let workCenter of this.workCentersForWorker) {
        workCenterItems.push(workCenter.name + ' (' + workCenter.code + ')')
      }
      return workCenterItems
    },
    onClickFixWorkCenter() {
      this.fixWorkCenter('')
    },
    async initialize() {
      await this.$store.dispatch('mes/initializeProperties')
      if (this.workCenterToFix != null) {
        this.fixWorkCenter(this.workCenterToFix)
      }
    },
    fixWorkCenter(workCenter) {
      if (this.properties) {
        this.$store.dispatch('mes/fixWorkCenterForWorker', { workCenterCode: workCenter, workerCode: this.properties.workerCode })
      } else {
        this.workCenterToFix = workCenter
      }
    }
  }
}
</script>

<style type="text/css" scoped>
</style>
