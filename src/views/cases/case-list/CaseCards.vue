<template>
  <v-data-iterator :items="cases"
                   items-per-page.sync="itemsPerPage"
                   :page="page"
                   :search="search"
                   :hide-default-footer="hideFooter"
                   :no-data-text="hideNoData ? '' : $t('cases.noCases')"
                   :footer-props="{itemsPerPageText: $t('cases.perPage')}"
                   class="d-flex flex-column"
                   style="min-height: 0">

    <template #default="{ items }">
      <perfect-scrollbar tag="v-row" :options="scrollOptions">
        <v-col v-for="caseItem in items"
               :key="caseItem.id" cols="12" class="py-1">
          <case-list-item :caseItem="caseItem"/>
        </v-col>
      </perfect-scrollbar>
    </template>

    <template #no-data v-if="!hideNoData">
      <div :class="`primary--text body-2 ${ml}-3 mt-3`">{{ $t('cases.noCases') }}</div>
    </template>

  </v-data-iterator>
</template>

<script>
const CaseListItem = () => import('@/views/cases/case-list/CaseListItem.vue')

export default {
  name: 'CaseCards',
  components: {
    CaseListItem
  },
  props: {
    cases: Array,
    hideNoData: Boolean,
    hideFooter: Boolean
  },
  data: () => ({
    search: '',
    page: 1,
    itemsPerPage: 1,
    scrollOptions: {
      wheelSpeed: 0.3,
      suppressScrollX: true
    }
  }),
  computed: {
    numberOfPages () {
      return Math.ceil(this.items.length / this.itemsPerPage)
    }
  },
  methods: {
    nextPage () {
      if (this.page + 1 <= this.numberOfPages) this.page += 1
    },
    formerPage () {
      if (this.page - 1 >= 1) this.page -= 1
    },
    updateItemsPerPage (number) {
      this.itemsPerPage = number
    }
  }
}
</script>

<style scoped>

  /* Set pagination to left */
  .v-data-iterator >>> .v-data-footer {
    justify-content: flex-start;
    font-size: 14px;
  }

</style>
