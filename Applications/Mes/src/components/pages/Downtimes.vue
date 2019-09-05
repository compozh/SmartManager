<template>
    <v-layout class="mes-downtimes">

      <vue-split
        class="main-downtime-layout"
        :elements="[
          '#downtimeList',
          '#downtimeDescription'
        ]"
        direction="horizontal"
        :min-size="100"
        :gutter-size="5"
        :snap-offset="50"
        :sizes="this.defaultSizes"
      >
      <mes-downtimes-component
        id="downtimeList"
        :initializeDowntimes=initializeDowntimes
        @changeCurrentDowntime=changeCurrentDowntime
      />
      <mes-downtime-main-layout
        id="downtimeDescription"
      />
      </vue-split>
    </v-layout>
</template>

<script>
import VueSplit from 'vue-splitjs'

export default {
  name: 'mes-downtimes',
  data() {
    return {
      currentDate: new Date().toJSON(),
      initializeDowntimes: false,
      defaultSizes: [35, 65]
    }
  },
  created() {
    this.initialize()
  },
  components: { VueSplit },
  computed: {
    workCenter() {
      return this.$store.getters['mes/workCenter']
    },
    selectedDowntime: {
      get() {
        return this.tasksPageState.selectedDowntime
      },
      set(selectedDowntime) {
        this.$store.commit('mes/setSelectedDowntime', selectedDowntime)
      }
    },
  },
  methods: {
    async initialize() {
      await this.$store.dispatch('mes/initializeWorkCenter')
      await this.$store.dispatch('mes/downloadDowntimes', { workCenterCode: this.workCenter.code, dateTime: this.currentDate })
      this.initializeDowntimes = true
      // if (!this.selectedDowntime) {
      //   this.selectFirstTaskByTabIndex()
      // }
    },
    onChangeCurrentTask(newSelectedDowntime) {
      if (this.selectedDowntime && newSelectedDowntime.id == this.selectedDowntime.id) {
        return
      }
      // if (this.$refs.taskInProgressLayout && !this.dialogProperties.task) {
      //   let currentFormioData = this.$refs.taskInProgressLayout.getFormioData()

      //   if (this.productionFormio && this.checkChangeFormioData(this.productionFormio.data, currentFormioData)) {
      //     this.dialogProperties.visible = true
      //     this.dialogProperties.task = newSelectedDowntime
      //     return
      //   }
      // }
      this.changeCurrentDowntime(newSelectedDowntime)
    },
    changeCurrentDowntime(newSelectedDowntime) {
      this.selectedDowntime = newSelectedDowntime
      // this.$store.commit('mes/resetProductionFormio')
      // this.changeCurrentLayout('main')
    },
  }
}
</script>

<style type="text/css" scoped>
.mes-downtimes {
  height: 100%;
}
.main-downtime-layout {
  width: 100%;
}
</style>
