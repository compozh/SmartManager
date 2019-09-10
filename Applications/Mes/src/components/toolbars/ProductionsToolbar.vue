<template>
    <v-layout class="toolbar">
      <v-tabs v-model="selectedProductionTab">
        <v-tab v-for="tab in tabs" :key=tab.index @click="changeProductionTab(tab.index)" class="tab-item">
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
        {name: 'По всем рабочим центрам', index: '0'},
        {name: 'По текущему рабочему центру', index: '1'}
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
      if(this.selectedProductionTab == tabIndex) {
        return
      }
      this.$emit('changeProductionTab', tabIndex)
    }
  },
}
</script>

<style type="text/css" scoped>
  .toolbar {
    flex-direction: row;
    max-height: 50px;
  }
  .toolbar .tab-item {
    width: 250px;
    border-bottom: 2px solid #0000001c;
  }
</style>
