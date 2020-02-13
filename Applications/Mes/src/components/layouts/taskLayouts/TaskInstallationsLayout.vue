<template>
  <v-layout class="task-installations-layout-block">

    <mes-task-installations-layout-toolbar
      :installations=installations
      @removeAllInstallations=removeAllInstallations
      @submitQrCode=submitQrCode
    />
      <mes-content-loader class="mes-content-loader" v-if="!installationsInitialized && !installations.length" />

      <mes-installations-component
        :installations=installations
        ref="installationCards"
      />

      <span class="no-data-text" v-if="installationsInitialized && !installations.length">{{$t('mes.labels.AbsentInstalledParties')}}</span>

  </v-layout>
</template>

<script>
import { events } from '../../../constants'
import { eventBus } from '../../../main'

export default {
  name: 'mes-task-installations-layout',
  created() {
    if(!this.cameraSettings.initialized) {
      this.$store.dispatch('mes/verifyCamera').then(result => {
        this.$store.commit('mes/setCameraInitialized',  true)
      })
    }
    this.initializeInstallations()

    eventBus.$on(events.scannedBarCode, this.registerMaterialInstallationByScanned)
  },
  beforeDestroy() {
    eventBus.$off(events.scannedBarCode, this.registerMaterialInstallationByScanned)
  },
  data() {
    return {
      installations: [],
      installationsInitialized: false
    }
  },
  computed: {
    workCenter() {
      return this.$store.getters['mes/workCenter']
    },
    selectedTask() {
      return this.$store.getters['mes/selectedTask']
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
    registerMaterialInstallationByScanned(qrCodeValue) {
      this.submitQrCode({ qrCodeValue })
    },
    async submitQrCode({ qrCodeValue, callback}) {

      if (this.highlightInstallation(qrCodeValue)) {
        if (callback) {
          callback()
        }

        return
      } else {
        this.registerMaterialInstallation(qrCodeValue).then(() => {
          if (callback) {
            callback()
          }
        })
      }
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
    highlightInstallation(qrCodeValue) {
      let installationCards = this.$refs.installationCards,
        installationCard = installationCards.$refs[qrCodeValue],
        installationsBlock = installationCards.$refs.installationsBlock

      if (installationCard && installationCard.length) {
        installationsBlock.scrollTo(0, installationCard[0].$el.offsetTop) // ToDo Проверить методв $vuetify.goto(target, option) после обновления Vuetify до 2.0
        installationCard[0].$el.classList.add('activeInstallation')
        setTimeout(() => { installationCard[0].$el.classList.remove('activeInstallation') }, 2000)

        return true
      }

      return false
    }
  }
}
</script>

<style type="text/css" scoped>
  .task-installations-layout-block {
    display: block;
    height: 100%;
  }
  .mes-task-installations-layout::-webkit-scrollbar {
    background-color:#fff;
    width:16px
  }
  .mes-task-installations-layout::-webkit-scrollbar-track {
      background-color:#fff
  }
  .mes-task-installations-layout::-webkit-scrollbar-track:hover {
      background-color:#f4f4f4
  }

  /* scrollbar itself */
 .mes-task-installations-layout::-webkit-scrollbar-thumb {
      background-color:#babac0;
      border-radius:16px;
      border:5px solid #fff
  }
  .mes-task-installations-layout::-webkit-scrollbar-thumb:hover {
      background-color:#a0a0a5;
      border:4px solid #f4f4f4
  }

  /* set button(top and bottom of the scrollbar) */
  .mes-task-installations-layout::-webkit-scrollbar-button {display:none}

  .mes-content-loader {
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
