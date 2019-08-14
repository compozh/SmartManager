<template>
    <v-container fluid v-if="applications">
        <v-layout row justify-end>
            <v-btn icon v-show="this.$vuetify.breakpoint.smAndUp">
                <v-icon v-text="rowView ? 'view_stream' : 'view_column'" @click="rowView = !rowView"/>
            </v-btn>
        </v-layout>
        <!-- Карточки -->
        <v-layout v-bind="{ [`${rowView ? 'row' : 'column'}`]: true }" justify-center  wrap>
            <v-flex xs12 sm5 md5 lg5 xl5
                v-for="application in getItemsOnPage()" :key="application.id" 
                v-bind:pagination.sync="pagination"
                v-touch="{
                            left: () => swipeLeft(application),
                            right: () => swipeRight(application),
                        }"
                >
                   <applicationCard :application="application" />
            </v-flex>
        </v-layout>
        <!-- Пагинатор -->
        <v-pagination
            v-model="pagination.page" :length="pages"
            :total-visible="7"
            />
    </v-container>
</template>

<script>
import moment from 'moment'
import {PurchasesApi} from '../../../api/purchasesApi'

const api = new PurchasesApi()

export default {
  name: 'applications',
  //props: ["applications"],
  data: () => ({
    rowView: true,
    smallSize: true,
    pagination: {
      page: 1
    }
  }),
  filters: {
    formatDate: (value) => {
      if (value) {
        return moment(String(value)).format('DD.MM.YYYY')
      }
    }
  },
  computed: {
    pages: {
      get() { 
        debugger
        return Math.ceil(this.applications.length / this.rowsPerPage)
      }
    },
    rowsPerPage: {
      get() {
        return this.rowView ? 24 : 18
      }
    },
    applications: {
      get: function() {
        return this.$store.getters['purchases/getApplications']
      },
      set: function(newVal) {
        this.$store.commit('purchases/setApplications', newVal)
      }
    },
  },
  methods: {
    getItemsOnPage() {
      debugger
      return this.applications.slice(
        (this.pagination.page - 1) * this.rowsPerPage, 
        this.pagination.page * this.rowsPerPage)
    },
    sizeItemsFltr() {
      return this.sizeItems.filter(i => this.$vuetify.breakpoint.mdAndUp || i.value != 3)
    },
    swipeLeft(appl) {
      console.log(`TODO: swipe left for application #${appl.number}`)
    },
    swipeRight(appl) {
      console.log(`TODO: swipe right for application #${appl.number}`)
    }
  },
  mounted() {
    api.getFavLists()
    api.getApplications()
  },
  created() {   
  },
}
</script>

<style scoped>


.application-card{
    padding: 5px;
    margin: 5px;
}
.application-card a{
    text-decoration: none;
}
.application-card .v-card__title {
    font-size: 15px;
    font-weight: 600;
    padding: 5px 15px;
}

.application-card .v-card__text {
    text-align: left;
    margin-left: 10px;
    padding: 5px;
    height: 40px;
}
.application-card .v-card__actions {
    padding: 5px;
}
.application-execution{
    margin: 0px 0px 5px 0px;
}

</style>