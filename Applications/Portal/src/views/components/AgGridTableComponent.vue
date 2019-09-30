<template>
  <div id="ag-grid" >
    <vx-card>
      <ag-grid-vue
        class="ag-theme-material my-grid w-100 my-4 ag-grid-table"
        :gridOptions="gridOptions"
        :columnDefs="headers"
        :defaultColDef="defaultColDef"
        :rowData="education.data"
        :animateRows="true"
        >
      </ag-grid-vue>
    </vx-card>
  </div>
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
      gridOptions: { },
      defaultColDef: {
        sortable: true,
        resizable: true,
        suppressMenu: true,
      },
      gridApi: null,
     
      columnDefs: [ ],
      
    }
  },
  computed: {
    headers() {
      return this.education.headers.map(element => {
        var object = element
        object.filter = true
        return object
      })
    }
  },
  
  mounted() {
    this.gridApi = this.gridOptions.api
    this.gridColumnApi = this.gridOptions.columnApi
    // Установка ширины колонок
    this.gridApi.sizeColumnsToFit()

    // Установка высоты, на весь контент
    var eGridDiv = document.querySelector('.my-grid')
    eGridDiv.style.height = '100%'
    this.gridApi.setDomLayout('print')
  },
}

</script>
<style scoped>
#ag-grid{
    width: 100%;
}
</style>