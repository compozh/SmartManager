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
        class="ag-theme-material w-100 my-4 ag-grid-table"
        :columnDefs="columnDefs"
        :rowData="document.rows"
        :defaultColDef="defaultColDef"
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
      defaultColDef: [
        {
          sortable: true,
          editable: true,
          resizable: true,
          suppressMenu: true
        }
      ],
      columnDefs: [
        { headerName: 'ID', field: 'id', width: 70 },
        { headerName: 'Ключ', field: 'resource', width: 250 },
        { headerName: 'Лицензий', field: 'count', width: 130 },
        // {
        //   headerName: 'Откуда',
        //   children: [
        //     { headerName: 'Объект', field: 'creditObject', width: 120 },
        //     { headerName: '', field: 'credit' },
        //     { headerName: 'Счет', field: 'creditAccount', width: 120 }
        //   ]
        // },
        // {
        //   headerName: 'Куда',
        //   children: [
        //     { headerName: 'Объект', field: 'debitObject', width: 120 },
        //     { headerName: '', field: 'debit' },
        //     { headerName: 'Счет', field: 'debitAccount', width: 120 }
        //   ]
        // }
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

<style lang="scss" scoped>
.list-view-item {
  .item-name,
  .item-description {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .item-name {
    -webkit-line-clamp: 2;
  }

  .item-description {
    -webkit-line-clamp: 5;
  }

  .grid-view-img {
    max-width: 100%;
    max-height: 100%;
    width: auto;
    transition: 0.35s;
  }
}
</style>
