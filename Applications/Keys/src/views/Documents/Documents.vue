<!-- =========================================================================================
  File Name: DataListListView.vue
  Description: Data List - List View
========================================================================================== -->

<template>
  <div id="documents-list-view">
    <!-- FILTERS -->
    <vs-sidebar
      parent="#documents-list-view"
      class="items-no-padding vs-sidebar-rounded background-absolute"
      :click-not-close="clickNotClose"
      :hidden-background="clickNotClose"
      v-model="filterIsActive"
    >
      <div class="p-6 filter-container">
        <h6 class="font-bold mb-3">Период</h6>
        <ul>
          <li class="flex items-center cursor-pointer py-1">
            <datepicker
              :language="datelocale"
              format="dd.MM.yyyy"
              placeholder="с"
              v-model="dateFrom"
              :highlighted="highlightedDates"
            ></datepicker>
            <span class="flex-grow px-2">-</span>
            <datepicker
              :language="datelocale"
              format="dd.MM.yyyy"
              placeholder="по"
              v-model="dateTo"
              :highlighted="highlightedDates"
            ></datepicker>
          </li>
        </ul>
        <vs-divider></vs-divider>
        <h6 class="font-bold mb-3">Номер документа</h6>
        <ul>
          <li class="flex items-center cursor-pointer py-1">
            <vs-input></vs-input>
          </li>
        </ul>
      </div>
    </vs-sidebar>
    <!-- CONTENT -->
    <div :class="{'sidebar-spacer-with-margin': clickNotClose}">
      <h6 class="py-3">Всего документов: {{totalDocuments.length}}</h6>

      <div :key="doc.id" v-for="doc in documents">
        <documents-item @click="onDocumentClick" :item="doc"></documents-item>
      </div>
      <vs-pagination :total="totalPages" v-model="currentPage"></vs-pagination>
    </div>
  </div>
</template>

<script>
import Datepicker from 'vuejs-datepicker'
import { en, ru, uk } from 'vuejs-datepicker/dist/locale'
let localiztions = {
  en,
  ru,
  uk
}

export default {
  components: {
    Datepicker,
    DocumentsItem: () => import('./DocumentsItem.vue')
  },
  data() {
    return {
      isMounted: false,
      addNewDataSidebar: false,
      filterIsActive: true,
      clickNotClose: true,
      currentPage: 1,
      documentsOnPage: 15
    }
  },
  computed: {
    highlightedDates() {
      return {
        from: this.dateFrom,
        to: this.dateTo
      }
    },
    datelocale() {
      return localiztions[this.$i18n.locale]
    },
    dateFrom: {
      get() {
        return this.$store.state.app.filter.dateFrom
      },
      set(v) {
        this.currentPage = 1
        this.$store.dispatch('app/setFilter', {
          dateFrom: v
        })
      }
    },
    dateTo: {
      get() {
        return this.$store.state.app.filter.dateTo
      },
      set(v) {
        this.currentPage = 1
        this.$store.dispatch('app/setFilter', {
          dateTo: v
        })
      }
    },
    totalDocuments() {
      return this.$store.state.app.documents
    },
    totalPages() {
      return Math.ceil(
        this.$store.state.app.documents.length / this.documentsOnPage
      )
    },
    documents() {
      return this.$store.state.app.documents.slice(
        this.documentsOnPage * (this.currentPage - 1),
        this.documentsOnPage * this.currentPage
      )
    }
  },
  methods: {
    onDocumentClick(item) {
      this.$router.push({path: `/${item.id}`})
    }
  },
  created() {
    const thisIns = this
    this.$store.dispatch('app/loadDocuments').catch(function(error) {
      thisIns.$vs.notify({
        title: 'Error',
        text: error,
        color: 'danger',
        iconPack: 'feather',
        icon: 'icon-alert-circle'
      })
    })
  },
  mounted() {
    this.isMounted = true
  }
}
</script>

<style lang="scss">
#documents-list-view {
  position: relative;
  .vs-sidebar {
    position: relative;
    float: left;
    .vs-sidebar--items {
      overflow: visible;
    }
  }
}
@media (min-width: 992px) {
  .vs-sidebar-rounded {
    .vs-sidebar {
      border-radius: 0.5rem;
    }
    .vs-sidebar--items {
      border-radius: 0.5rem;
    }
  }
}
</style>
