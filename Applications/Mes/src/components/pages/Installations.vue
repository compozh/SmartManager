<template>
  <v-layout class="mes-installations">

    <mes-installations-toolbar
      class="mes-installations-toolbar"
      :installations=installations
      @removeAllInstallations=removeAllInstallations
      @submitQrCode=submitQrCode
    />

    <mes-content-loader v-if="!initializeInstallations && !installations.length" />

    <mes-installations-component
      ref="installationCards"
    />
    <span class="no-data-text" v-if="initializeInstallations && installations.length == 0">Нет установленных партий</span>
  </v-layout>
</template>

<script>

export default {
  name: 'mes-installations',

  data() {
    return {
      initializeInstallations: false
    }
  },
  created() {
    this.initialize()
  },
  computed: {
    workCenter() {
      return this.$store.getters['mes/workCenter']
    },
    installations() {
      return this.$store.getters['mes/installations']
    }
  },
  methods: {
    async initialize() {
      await this.$store.dispatch('mes/initializeWorkCenter')
      await this.$store.dispatch('mes/initializeInstallations', { workCenterCode: this.workCenter.code })
      this.initializeInstallations = true
    },
    removeAllInstallations() {
      for (let installation of this.installations) {
        this.removeInstallation(installation)
      }
    },
    removeInstallation(installation) {
      this.$store.dispatch('mes/removeInstallation', installation)
    },
    async submitQrCode({ qrCodeValue, callback }) {
      let installationCards = this.$refs.installationCards,
        installationCard = installationCards.$refs[qrCodeValue],
        installationsBlock = installationCards.$refs.installationsBlock

      if (installationCard && installationCard.length) {
        installationsBlock.scrollTo(0, installationCard[0].$el.offsetTop) // ToDo Проверить методв $vuetify.goto(target, option) после обновления Vuetify до 2.0
        installationCard[0].$el.classList.add('activeInstallation')
        setTimeout(() => { installationCard[0].$el.classList.remove('activeInstallation') }, 2000)
        if (callback) {
          callback()
        }
        return
      }
      await this.$store.dispatch('mes/registerMaterialInstallation', { workCenterCode: this.workCenter.code, batchBarcode: qrCodeValue, factId: 0 })
      if (callback) {
        callback()
      }
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
