<template>
  <vx-card class="overflow-hidden">
    <div v-if="document" class="p-3 flex flex-col document-details" slot="no-body">
      <span class="float-right text-grey">#{{document.id}}</span>
      <h5 class="pb-3">Документ номер {{document.number}}</h5>
      <div class="flex items-center pb-3">
        <div class="text-grey pr-3">от {{document.date|moment("DD.MM.YYYY")}}</div>
        <vs-chip v-if="document.isPosted" color="primary">Разнесен</vs-chip>
      </div>
      {{document.comment}}
      <vs-divider />

      <ag-grid-vue
      class="ag-theme-material my-4 flex-grow"
        :columnDefs="columnDefs"
        :defaultColDef="defaultColDef"
        :rowData="rows"
      ></ag-grid-vue>
    </div>
        <add-document-row-form :active="showAddForm">

    </add-document-row-form>
  </vx-card>
</template>

<script>
import { AgGridVue } from 'ag-grid-vue'
import ButtonColumn from './ButtonColumn'
import '@/assets/scss/vuesax/extraComponents/agGridStyleOverride.scss'

export default {
  components: {
    AgGridVue,
    AddDocumentRowForm: () => import('./AddDocumentRowForm.vue'),

  },
  data() {
    return {
      defaultColDef:
        { resizable: true }
      ,
      columnDefs: [
        { cellRendererFramework: ButtonColumn, cellClass: 'row-buttons', width: 75, resizable: false},
        { headerName: 'ID', field: 'id', width: 70 },
        { headerName: 'Ключ', field: 'resource', width: 250 },
        { headerName: 'Лицензий', field: 'count', width: 130 },
        { headerName: 'Откуда. Объект', field: 'creditObject', width: 120, headerTooltip: 'Откуда. Объект' },
        { headerName: 'Откуда. Наименование', field: 'credit', tooltipField: 'credit', headerTooltip: 'Откуда. Наименование'  },
        { headerName: 'Откуда. Счет', field: 'creditAccount', width: 120 , headerTooltip: 'Откуда. Счет' },
        { headerName: 'Куда. Объект', field: 'debitObject', width: 120, headerTooltip: 'Куда. Объект'  },
        { headerName: 'Куда. Наименование', field: 'debit', tooltipField: 'debit', headerTooltip: 'Куда. Наименование'  },
        { headerName: 'Куда. Счет', field: 'debitAccount', width: 120 , headerTooltip: 'Куда. Счет' },
      ]
    }
  },
  computed: {
    document() {
      return this.$store.state.app.documentDetails
    },
    rows() {
      return this.document.rows
    },
    showAddForm() {
      return this.$store.state.app.showAddDocumentRowForm
    }
  },

  created() {
    const thisIns = this
    this.$store
      .dispatch('app/loadDocumentDetails', this.$route.params.id)
      .catch(function(error) {
        thisIns.$vs.notify({
          title: 'Error',
          text: error,
          color: 'danger',
          iconPack: 'feather',
          icon: 'icon-alert-circle'
        })
      })
  }
}
</script>

<style lang="scss">
.ag-theme-material{
  color:inherit
}
.ag-theme-material .ag-tooltip{
  background-color: #fff !important;
}
.row-buttons{
  padding: 0 !important;
  border:none !important;
}
.document-details{
  height: calc(100vh - 190px);
  min-height: 450px;
}
</style>
