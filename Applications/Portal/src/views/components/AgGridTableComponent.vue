<template>
  <vx-card class="overflow-hidden">
    <ag-grid-vue
      class="ag-theme-material my-4 flex-grow my-ag-grid"
      :gridOptions="gridOptions"
      :columnDefs="columnDefs"
      :defaultColDef="defaultColDef"
      :rowData="rows"
      :frameworkComponents="frameworkComponents"
    ></ag-grid-vue>
  </vx-card>
</template>

<script>
import { AgGridVue } from 'ag-grid-vue'
import CustomTooltip from './customTooltip.vue'

import '@/assets/scss/vuesax/extraComponents/agGridStyleOverride.scss'

export default {
  components: {
    AgGridVue,
  },
  props: ['education'],
  data() {
    return {
      frameworkComponents: null,
      searchQuery: '',
      // Зебра для строк
      gridOptions: { rowStyle: {background: '#f8f8f8'},
        getRowStyle: function(params) {
          if (params.node.id % 2 === 0) {
            return { background: '#ffffff' }
          }
        }
      },
      defaultColDef: {
        resizable: true,
      },
      gridApi: null,
    }
  },
  computed: {
    // Заголовки и их свойства
    columnDefs() {
      if (!this.education) {
        return null
      }
      // Встраиваем tooltip
      let headers = this.education.headers.map(el => {
        let element = el
        element.tooltipComponent = 'customTooltip',
        element.tooltipValueGetter = params => {
          return { value: params.value }
        }
        return element
      })
      return headers
    },
    // Значение строк
    rows() {
      if (!this.education) {
        return null
      }
      return this.education.data
    },
  },
  beforeMount() {
    this.frameworkComponents = { customTooltip: CustomTooltip }
  },
  mounted() {
    if (!this.education) {
      return
    }

    this.gridApi = this.gridOptions.api
    this.gridColumnApi = this.gridOptions.columnApi
    // Установка ширины колонок
    this.gridApi.sizeColumnsToFit()
    
    // Установка высоты, на весь контент (кол-во строк * высоту + шапка и место под скролл)
    var agGrid = document.querySelector('.my-ag-grid')
    agGrid.style.height = (this.rows.length * 50) + 100 + 'px'
  },
}
</script>

<style scoped>
.my-header{
  color: red !important;
}
</style>