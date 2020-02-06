<template>
  <v-layout class="mes-installations">

    <mes-installations-toolbar
      class="mes-installations-toolbar"
      :installations=installations
      @removeAllInstallations=removeAllInstallations
      @submitQrCode=submitQrCode
    />

    <mes-content-loader v-if="!installationsInitialized && !installations.length" :loaderType="$vuetify.breakpoint.xs ? 'list' : ''" />
      <mes-installations-component
        :installations=installations
        ref="installationCards"
      />
    <span class="no-data-text" v-if="installationsInitialized && installations.length == 0">{{this.$t('mes.labels.AbsentInstalledParties')}}</span>
  </v-layout>
</template>

<script>
import { events } from '../../constants'
import { eventBus } from '../../main'

export default {
  name: 'mes-installations',
  data() {
    return {
      installations: [],
      installationsInitialized: false
    }
  },
  created() {
    if(!this.cameraSettings.initialized) {
      this.$store.dispatch('mes/verifyCamera').then(result => {
        this.$store.commit('mes/setCameraInitialized',  true)
      })
    }
    this.initializeInstallations()

    eventBus.$on(events.scannedBarCode, this.registerMaterialInstallation)
  },
  beforeDestroy() {
    eventBus.$off(events.scannedBarCode, this.registerMaterialInstallation)
  },
  computed: {
    workCenter() {
      return this.$store.getters['mes/workCenter']
    },
    cameraSettings() {
      return this.$store.getters['mes/cameraSettings']
    }
  },
  methods: {
    async initializeInstallations() {
      await this.$store.dispatch('mes/initializeInstallations', { workCenterCode: this.workCenter.code }).then(result => {
        this.installations = result
        this.installationsInitialized = true
      })
    },
    removeAllInstallations() {
      for (let installation of this.installations) {
        this.removeInstallation(installation)
      }
    },
    removeInstallation(installation) {
      this.$store.dispatch('mes/removeInstallation', installation).then(result => {
         if(result.success) {
          var index = this.installations.indexOf(installation)
          this.installations.splice(index, 1)
        }
      })
    },
    async submitQrCode({ qrCodeValue, callback }) {
      let installationCards = this.$refs.installationCards,
        installationCard = installationCards.$refs[qrCodeValue],
        installationsBlock = installationCards.$refs.installationsBlock

      if (installationCard && installationCard.length &&  installationCard[0].$el) {
        installationsBlock.scrollTo(0, installationCard[0].$el.offsetTop) // ToDo Проверить методв $vuetify.goto(target, option) после обновления Vuetify до 2.0
        installationCard[0].$el.classList.add('activeInstallation')
        setTimeout(() => { installationCard[0].$el.classList.remove('activeInstallation') }, 2000)
        if (callback) {
          callback()
        }
        return
      }
      this.registerMaterialInstallation(qrCodeValue).then(() => {
        if (callback) {
          callback()
        }
      })
    },
    async registerMaterialInstallation(batchBarcode) {
      this.$store.commit('mes/setLinearLoader', true)
      var result = await this.$store.dispatch('mes/registerMaterialInstallation',
        { workCenterCode: this.workCenter.code, batchBarcode, factId: 0 }
      )
      if(result.success) {
        await this.initializeInstallations()
      }
      this.$store.commit('mes/setLinearLoader', false)
    }
  }
}
</script>

<style type="text/css" scoped>
  .mes-installations {
    display:block;
    height: 100%;
  }
  .wait-for-data-block {
    padding: 20px;
  }
  .mes-content-loader {
    z-index: 1;
    
    width: 100%;
  }
  .no-data-text {
    position: absolute;
    left: 20px;
    top: 70px;
    font-size: 2em;
    font-weight: 500;
    color: #3d83f7;
    opacity: 0.5;
  }
</style>
