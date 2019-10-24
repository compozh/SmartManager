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
        :initializeQualities=initializeQualities
        @changeCurrentQuality=changeCurrentQuality
        @uploadQualityOnScroll=uploadQualityOnScroll
        :isUploadInProcess=isUploadInProcess
      />
      <mes-quality-main-layout
        id="qualitiesDescription"
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
      currentDate: new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toJSON(),
      initializeQualities: false,
      defaultSizes: [35, 65],
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
    qualities() {
      return this.$store.getters['mes/qualities']
    },
    properties() {
      return this.$store.getters['mes/properties']
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
        this.$store.commit('mes/setQualities', [])
      }
      await this.$store.dispatch('mes/downloadQualities', { processTypeCode: this.properties.qualityProcessType, searchDateTime: this.currentDate , direction: 1 })
      this.initializeQualities = true
      if (!this.selectedQuality) {
        this.seelectFirstQuality()
      }
    },
    changeCurrentQuality(newSelectedQuality) {
      if (this.selectedQuality == newSelectedQuality) {
        return
      }
      this.selectedQuality = newSelectedQuality
      // this.$store.dispatch('formio').then((formDefinition) => {
      //   commit('mes/setQualityFormio', formDefinition)
      // }).catch((err) => {

      // });
      this.$store.dispatch('mes/initializeQualityFormio', { formCode: this.properties.qualityForm, workCenter: this.workCenter, qualityId: newSelectedQuality.id } )
    },
    seelectFirstQuality() {
      if (this.qualities.length) {
        this.changeCurrentQuality(this.qualities[0])
      }
    },
    async uploadQualityOnScroll(lastQualityDate) {
      this.isUploadInProcess = true
      await this.$store.dispatch('mes/downloadQualities', { processTypeCode: this.properties.qualityProcessType, searchDateTime: lastQualityDate , direction: 1 })
      this.isUploadInProcess = false
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
</style>
