<template>
    <v-layout class="mes-productions">
      <mes-production-toolbar/>
      <div class="production-main-block">
        <mes-content-loader v-if="!initializeProductions && !productions.length"/>
        <mes-productions-component :productions=productions />

        <span class="no-data-text" v-if="initializeProductions && productions.length == 0">Нет факта регистрации выработки за смену</span>
      </div>
    </v-layout>
</template>

<script>

export default {
  name: 'mes-productions',
  data() {
    return {
      initializeProductions: false
    }
  },
  created() {
    this.initialize()
  },
  mounted() {
    if (this.initialWorkCenter && this.workCenter.accessPages == 'ONLY_INSTALLATION') {
      this.$router.replace({path: '/MES/installations'})
      return
    }
  },
  computed: {
    initialWorkCenter() {
      return this.$store.getters['mes/initialWorkCenter']
    },
    workCenter() {
      return this.$store.getters['mes/workCenter']
    },
    properties() {
      return this.$store.getters['mes/properties']
    },
    usersProductionEvents() {
      return this.$store.getters['mes/usersProductionEvents']
    },
    workCenterProductionEvents() {
      return this.$store.getters['mes/workCenterProductionEvents']
    },
    selectedProductionTab: {
      get() {
        return this.$store.getters['mes/selectedProductionTab']
      },
      set(selectedProductionTab) {
        return this.$store.commit('mes/setSelectedProductionTab', selectedProductionTab)
      }
    },
    productions() {
      if (this.selectedProductionTab == 0) {
        return this.usersProductionEvents
      }

      return this.workCenterProductionEvents
    }
  },
  methods: {
    async initialize() {
      await this.$store.dispatch('mes/initializeProperties')
      if (this.selectedProductionTab == 0) {
        await this.$store.dispatch('mes/initializeUsersProductionEvents', { workerCode: this.properties.workerCode, fetchPolicy: 'network-only' })
      } else {
        await this.$store.dispatch('mes/initializeWorkCenterProductionEvents', { workCenterCode: this.workCenter.code, fetchPolicy: 'network-only' })
      }
      this.initializeProductions = true
    }
  }
}
</script>

<style type="text/css" scoped>
  .mes-productions {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    height: 100%;
    overflow-x: hidden;
    width: 100%;
  }
  .production-main-block {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    padding: 0 10px;
    margin-top: 50px;
    position: absolute;
    height: calc(100%-50px);
    overflow-y: auto;
    overflow-x: hidden;
    width: 100%;
  }
.production-main-block::-webkit-scrollbar {
    background-color:#fff;
    width:16px
  }
  .production-main-block::-webkit-scrollbar-track {
      background-color:#fff
  }
  .production-main-block::-webkit-scrollbar-track:hover {
      background-color:#f4f4f4
  }

  /* scrollbar itself */
  .production-main-block::-webkit-scrollbar-thumb {
      background-color:#babac0;
      border-radius:16px;
      border:5px solid #fff
  }
  .production-main-block::-webkit-scrollbar-thumb:hover {
      background-color:#a0a0a5;
      border:4px solid #f4f4f4
  }

  /* set button(top and bottom of the scrollbar) */
  .production-main-block::-webkit-scrollbar-button {display:none}
  .mes-content-loader {
    position: absolute;
    z-index: 1;
    width: 100%;
  }
  .wait-for-data-block {
    padding: 20px;
  }
  .no-data-text {
    position: absolute;
    left: 20px;
    top: 100px;
    font-size: 2em;
    font-weight: 500;
    color: #3d83f7;
    opacity: 0.5;
  }
</style>
