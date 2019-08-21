<template>
  <v-layout class="task-installations-layout-block">

    <mes-task-installations-layout-toolbar
      @removeAllInstallations=removeAllInstallations
      @submitQrCode=submitQrCode
    />
      <mes-content-loader class="mes-content-loader" v-if="!initializeInstallations && !installations.length" />

      <mes-installations-component
        ref="installationCards"
      />

      <span class="no-data-text" v-if="initializeInstallations && installations.length == 0">Нет установленных партий</span>

  </v-layout>
</template>

<script>

export default {
  name: 'mes-task-installations-layout',
  created() {
    this.initialize()
  },
  data() {
    return { initializeInstallations: false }
  },
  computed: {
    workCenter() {
      return this.$store.getters['mes/workCenter']
    },
    installations() {
      return this.$store.getters['mes/installations']
    },
    selectedTask() {
      return this.$store.getters['mes/selectedTask']
    }
  },
  methods: {
    async initialize() {
      await this.$store.dispatch('mes/initializeInstallations', { workCenterCode: this.workCenter.code })
      this.initializeInstallations = true
    },
    async submitQrCode({ qrCodeValue, callback}) {
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
    },
    removeAllInstallations() {
      for (let installation of this.installations) {
        this.removeInstallation(installation)
      }
    },
    removeInstallation(installation) {
      this.$store.dispatch('mes/removeInstallation', installation)
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
    font-size: 1.5em;
    font-weight: 300;
    color: #3d83f7;
    opacity: 0.5;
  }
</style>
