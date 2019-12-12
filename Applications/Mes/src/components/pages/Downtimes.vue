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
        @uploadDowntimeOnScroll=uploadDowntimeOnScroll
        :isUploadInProcess=isUploadInProcess
      />
      <mes-downtime-main-layout
        id="downtimeDescription"
        :initializeDowntimes=initializeDowntimes
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
      defaultSizes: [25, 75],
      isUploadInProcess: false
    }
  },
  mounted() {
    if (this.initialWorkCenter && this.workCenter.accessPages == 'ONLY_INSTALLATION') {
      this.$router.replace({path: '/MES/installations'})
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
      if (this.downtimes.length) {
        this.$store.commit('mes/setDowntimes', [])
      }
      await this.$store.dispatch('mes/downloadDowntimes', { workCenterCode: this.workCenter.code, dateTime: this.currentDate })
      this.initializeDowntimes = true
      if (!this.selectedDowntime) {
        this.seelectFirstDowntime()
      }
    },
    async changeCurrentDowntime(newSelectedDowntime) {
      var me = this
      if (me.selectedDowntime == newSelectedDowntime) {
        return
      }
      me.selectedDowntime = newSelectedDowntime

      var formCode = me.workCenter.downtimeRegistrationFormCode,
        properties = {
          RCENTR: me.workCenter.code,
          ID: newSelectedDowntime.id
        }

      me.$store.commit('mes/resetDowntimeFormio')
      me.$store.commit('mes/setLinearLoader', true)
      await me.$store.dispatch('formio/getForm', { formCode, properties, fetchPolicy: 'network-only' }).then(result => {
        me.$store.commit('mes/setDowntimeFormio', result)
      })
      me.$store.commit('mes/setLinearLoader', false)
    },
    seelectFirstDowntime() {
      if (this.downtimes.length) {
        this.changeCurrentDowntime(this.downtimes[0])
      }
    },
    async uploadDowntimeOnScroll(lastDowntimeDate) {
      this.isUploadInProcess = true
      await this.$store.dispatch('mes/downloadDowntimes', { workCenterCode: this.workCenter.code, dateTime: lastDowntimeDate })
      this.isUploadInProcess = false
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
