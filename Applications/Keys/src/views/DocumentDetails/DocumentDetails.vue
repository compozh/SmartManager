<template>
  <vx-card class="list-view-item mb-5 overflow-hidden">
    <div v-if="document" class="p-3" slot="no-body">
      <span class="float-right text-grey">#{{document.id}}</span>
      <h5 class="pb-3">Документ номер {{document.number}}</h5>
      <div class="flex items-center pb-3">
        <div class="text-grey pr-3">от {{document.date|moment("DD.MM.YYYY")}}</div>
        <vs-chip v-if="document.isPosted" color="primary">Разнесен</vs-chip>
      </div>
      {{document.comment}}
      <vs-divider />

      <ag-grid-vue
      class="ag-theme-material my-4 "
        :columnDefs="columnDefs"
        :defaultColDef="defaultColDef"
        :rowData="document.rows"
        domLayout = "autoHeight"
      ></ag-grid-vue>
    </div>
  </vx-card>
</template>

<script>
import { AgGridVue } from 'ag-grid-vue'

import '@/assets/scss/vuesax/extraComponents/agGridStyleOverride.scss'

export default {
  components: {
    AgGridVue
  },
  data() {
    return {
      defaultColDef:
        { resizable: true }
      ,
      columnDefs: [
        { headerName: 'ID', field: 'id', width: 70 },
        { headerName: 'Ключ', field: 'resource', width: 250 },
        { headerName: 'Лицензий', field: 'count', width: 130 },
        {
          headerName: 'Откуда',
          children: [
            { headerName: 'Объект', field: 'creditObject', width: 120 },
            { headerName: 'Наименование', field: 'credit', tooltipField: 'credit' },
            { headerName: 'Счет', field: 'creditAccount', width: 120 }
          ]
        },
        {
          headerName: 'Куда',
          children: [
            { headerName: 'Объект', field: 'debitObject', width: 120 },
            { headerName: 'Наименование', field: 'debit', tooltipField: 'debit' },
            { headerName: 'Счет', field: 'debitAccount', width: 120 }
          ]
        }
      ]
    }
  },
  computed: {
    document() {
      return this.$store.state.app.documentDetails
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
.ag-theme-material .ag-tooltip{
  background-color: #fff !important;
}
</style>
