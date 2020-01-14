<template>
    <v-layout class="mes-qualities">
      <vue-split
        class="main-quality-layout"
        :elements="[
          '#qualitiesList',
          '#qualitiesDescription'
        ]"
        direction="horizontal"
        :min-size="100"
        :gutter-size="5"
        :snap-offset="50"
        :sizes="this.defaultSizes"
      >
      <mes-quality-component
        id="qualitiesList"
        @changeCurrentQuality=changeCurrentQuality
        @uploadQualityOnScroll=uploadQualityOnScroll
        @initialize=initialize
        :currentDate=currentDate
        :properties=properties
        :isUploadInProcess=isUploadInProcess
        :initializeQualities=initializeQualities
        v-if="$vuetify.breakpoint.smAndDown? qualityTableView : true"
        :class="$vuetify.breakpoint.smAndDown? 'quality-table-small' : ''"
        @changeQualityTableView=changeQualityTableView
      />
      <mes-quality-main-layout
        id="qualitiesDescription"
        :initializeQualities=initializeQualities
        @changeQualityTableView=changeQualityTableView
        v-if="$vuetify.breakpoint.smAndDown? !qualityTableView : true"
      />
      </vue-split>
    </v-layout>
</template>

<script>
import VueSplit from 'vue-splitjs'

export default {
  name: 'mes-quality',
  data() {
    return {
      initializeQualities: false,
      currentDate: new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toJSON(),
      defaultSizes: [25, 75],
      isUploadInProcess: false,
      qualityTableView: true
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
    qualities() {
      return this.$store.getters['mes/qualities']
    },
    properties() {
      return this.$store.getters['mes/properties']
    },
    documentSearchValue() {
      return this.$store.getters['mes/documentSearchValue']
    },
    selectedQuality: {
      get() {
        return this.$store.getters['mes/selectedQuality']
      },
      set(selectedQuality) {
        this.$store.commit('mes/setSelectedQuality', selectedQuality)
      }
    },
  },
  methods: {
    async initialize() {
      if (this.qualities.length) {
        this.initializeQualities = false
        this.$store.commit('mes/setQualities', [])
      }
      let qualities = await this.$store.dispatch('mes/downloadQualities', { processTypeCode: this.properties.qualityProcessType, searchDateTime: this.currentDate, query: this.documentSearchValue, direction: 1 })
      this.initializeQualities = true
      if (!this.selectedQuality) {
        this.seelectFirstQuality()
      }
      return qualities
    },
    changeCurrentQuality(newSelectedQuality) {
      var me = this
      if (me.selectedQuality == newSelectedQuality) {
        return
      }
      me.selectedQuality = newSelectedQuality

      var formCode = me.properties.qualityForm,
        properties = { RCENTR: me.workCenter.code , ID: newSelectedQuality.id },
        fetchPolicy = 'network-only',
        deviceSizeType = this.$vuetify.breakpoint.name

      me.$store.dispatch('formio/getForm', { formCode, properties, fetchPolicy, deviceSizeType }).then(result => {
          me.$store.commit('mes/setQualityFormio', result)
      })
    },
    seelectFirstQuality() {
      if (this.qualities.length) {
        this.changeCurrentQuality(this.qualities[0])
      }
    },
    async uploadQualityOnScroll(lastQualityDate) {
      this.isUploadInProcess = true
      await this.$store.dispatch('mes/downloadQualities', { processTypeCode: this.properties.qualityProcessType, searchDateTime: lastQualityDate, query: this.documentSearchValue, direction: 1 })
      this.isUploadInProcess = false
    },
    changeQualityTableView(mode) {
      this.qualityTableView = mode
    }
  }
}
</script>

<style type="text/css" scoped>
.mes-qualities {
  height: 100%;
}
.main-quality-layout {
  width: 100%;
}
.quality-table-small {
    min-width: 100vw
}
</style>
