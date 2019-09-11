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
      currentDate: new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toJSON(),
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
    downtimes() {
      return this.$store.getters['mes/downtimes']
    },
    selectedDowntime: {
      get() {
        return this.$store.getters['mes/selectedDowntime']
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
      if (!this.selectedDowntime) {
        this.seelectFirstDowntime()
      }
    },
    changeCurrentDowntime(newSelectedDowntime) {
      if (this.selectedDowntime == newSelectedDowntime) {
        return
      }
      this.selectedDowntime = newSelectedDowntime
      this.$store.dispatch('mes/initializeDowntimeFormio', this.workCenter)
    },
    seelectFirstDowntime() {
      if (this.downtimes.length) {
        this.changeCurrentDowntime(this.downtimes[0])
      }
    }
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
