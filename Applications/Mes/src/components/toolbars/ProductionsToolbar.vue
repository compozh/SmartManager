<template>
    <v-layout class="toolbar">
      <v-tabs v-model="selectedProductionTab" class="toolbar-tabs" :show-arrows="$vuetify.breakpoint.smAndDown">
        <v-tab v-for="tab in tabs" :key=tab.index @click="changeProductionTab(tab.index)" :class="`tab-item ${$vuetify.breakpoint.smAndDown ? 'small' : ''}`">
          {{tab.name}}
        </v-tab>
      </v-tabs>
    </v-layout>
</template>

<script>

export default {
  name: 'mes-production-toolbar',
  data() {
    return {
      tabs: [
        {name: this.$t('mes.buttons.MyProduction'), index: '0'},
        {name: this.$t('mes.buttons.ProductionOfTheCurrentWorkCenter'), index: '1'}
      ]
    }
  },
  computed: {
    selectedProductionTab: {
      get() {
        return this.$store.getters['mes/selectedProductionTab']
      },
      set(selectedProductionTab) {
        return this.$store.commit('mes/setSelectedProductionTab', selectedProductionTab)
      }
    }
  },
  methods: {
    changeProductionTab(tabIndex) {
      if (this.selectedProductionTab == tabIndex) {
        return
      }
      this.$emit('changeProductionTab', tabIndex)
    }
  },
}
</script>

<style type="text/css" lang="scss" scoped>
  .toolbar {
    flex-direction: row;
    max-height: 63px;
    display: flex;
    align-items: center;
  }
  .toolbar-tabs {
    padding: 0 5px;
  }
  .toolbar .tab-item {
    width: 350px;
    border-bottom: 2px solid #0000001c;
    &.small {
      width: 60vw;
    }
  }
</style>
