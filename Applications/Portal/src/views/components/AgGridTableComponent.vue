<template>
  <vx-card class="overflow-hidden">
    <ag-grid-vue
      class="ag-theme-material my-4 flex-grow my-ag-grid"
      :gridOptions="gridOptions"
      :columnDefs="columnDefs"
      :defaultColDef="defaultColDef"
      :rowData="rows"
    ></ag-grid-vue>

  </vx-card>
</template>

<script>
import { AgGridVue } from 'ag-grid-vue'

import '@/assets/scss/vuesax/extraComponents/agGridStyleOverride.scss'

export default {
  components: {
    AgGridVue,
  },
  props: ['education'],
  data() {
    return {
      searchQuery: '',
      // Зебря для строк
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
      return this.education.headers
    },
    // Значение строк
    rows() {
      return this.education.data
    },
  },
  mounted() {
    this.gridApi = this.gridOptions.api
    // Установка ширины колонок
    this.gridApi.sizeColumnsToFit()

    // Установка высоты, на весь контент (кол-во строк * высоту + шапка и место под скролл)
    var agGrid = document.querySelector('.my-ag-grid')
    agGrid.style.height = (this.rows.length * 50) + 100 + 'px'
  },
}
</script>
