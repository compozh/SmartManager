<template>
    <v-layout class="mes-productions">

      <mes-content-loader v-if="!initializeProductions && !productions.length" />

      <mes-productions-component/>

      <span class="no-data-text" v-if="initializeProductions && productions.length == 0">Нет факта регистрации выработки за смену</span>

    </v-layout>
</template>

<script>

export default {
  name: 'mes-productions',
  data() {
    return { initializeProductions: false }
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
    productions() {
      return this.$store.getters['mes/productions']
    }
  },
  methods: {
    async initialize() {
      await this.$store.dispatch('mes/initializeProperties')
      await this.$store.dispatch('mes/initializeProductions', { workerCode: this.properties.workerCode, fetchPolicy: 'network-only' })
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
    padding: 0 10px;
    position: absolute;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    width: 100%;
  }
.mes-productions::-webkit-scrollbar {
    background-color:#fff;
    width:16px
  }
  .mes-productions::-webkit-scrollbar-track {
      background-color:#fff
  }
  .mes-productions::-webkit-scrollbar-track:hover {
      background-color:#f4f4f4
  }

  /* scrollbar itself */
  .mes-productions::-webkit-scrollbar-thumb {
      background-color:#babac0;
      border-radius:16px;
      border:5px solid #fff
  }
  .mes-productions::-webkit-scrollbar-thumb:hover {
      background-color:#a0a0a5;
      border:4px solid #f4f4f4
  }

  /* set button(top and bottom of the scrollbar) */
  .mes-productions::-webkit-scrollbar-button {display:none}
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
    top: 20px;
    font-size: 1.5em;
    font-weight: 300;
    color: #3d83f7;
    opacity: 0.5;
  }
</style>
