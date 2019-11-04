<template>
  <vx-card class="ag-card" >
    <ag-grid-vue
      class="ag-theme-material my-4 flex-grow my-ag-grid"
      :gridOptions="gridOptions"
      @grid-ready="onGridReady"
      @grid-columns-changed="eventChange"
      :defaultColDef="defaultColDef"
      :columnDefs="columnDefs"
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
        localeText: {
          noRowsToShow: this.$t('agGrid.NoRowsToShow'),
          contains: this.$t('agGrid.contains'),
          notContains: this.$t('agGrid.notContains'),
          startsWith: this.$t('agGrid.startsWith'),
          endsWith: this.$t('agGrid.endsWith'),
          equals: this.$t('agGrid.equals'),
          notEqual: this.$t('agGrid.notEqual'),
          andCondition: this.$t('agGrid.andCondition'),
          orCondition: this.$t('agGrid.orCondition'),
          filterOoo: this.$t('agGrid.filter')
        },
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
    myGrid() {
      return document.querySelector('.my-ag-grid')
    },
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
  methods: {
    onGridReady(params) {
      this.gridApi = params.api
      this.gridColumnApi = params.columnApi
    },
    eventChange(params) {
      if (!this.columnDefs) {
        return
      }
      // Установка ширины колонок
      setTimeout(() => params.api.sizeColumnsToFit(), 0)
      this.myGrid.style.height = (this.rows.length * 50) + 100 + 'px'
    }
  },
  destroyed() {
    var currentPage = this.$store.getters['education/getCurrentPageNabu']
    this.$store.commit(`education/${currentPage.clear}`, null)
  }

}
</script>

<style scoped>
::v-deep .ag-overlay-no-rows-center{
  position: relative;
  bottom: -25px;
  font-weight: 600;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.54);
}
</style>