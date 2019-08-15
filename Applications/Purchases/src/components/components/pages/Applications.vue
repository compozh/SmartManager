<template>
    <v-container fluid v-if="applications">
        <v-navigation-drawer fixed right app v-model="filterDrawer" >
        <v-layout class="filter-panel">
          <v-flex>
            <label v-text="$t('purchases.Catalog.FastFilter')" />
            <v-card elevation="0">
                <v-card-text>
                    <v-text-field v-model="search.searchText" :label="$t('purchases.Applications.Search')" clearable/>
                    <date-text-field editable="true" :dateType="this.search" fieldName="date_from"
                    :labelName="$t('purchases.Applications.From')"/>
                    <date-text-field editable="true" :dateType="this.search" fieldName="date_to"
                    :labelName="$t('purchases.Applications.To')"/>
                </v-card-text>
            </v-card>
            <v-card elevation="0">
                <v-card-title>
                    {{$t('purchases.Applications.Statuses')}}
                </v-card-title>
                <v-card-text>
                    <template v-for="(item, index) in this.statuses">
                        <v-checkbox class="statuses" v-model="search.statuses" :label="item.name" :value="item.id" :key="index"/>
                    </template>
                </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-navigation-drawer>
        <v-layout row justify-end>
            <v-btn icon v-show="this.$vuetify.breakpoint.smAndUp">
                <v-icon v-text="rowView ? 'view_stream' : 'view_column'" @click="rowView = !rowView"/>
            </v-btn>
            <v-btn icon @click="filterDrawer = !filterDrawer"><v-icon>filter_list</v-icon></v-btn>
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
import _ from 'lodash'
import {PurchasesApi} from '../../../api/purchasesApi'

const api = new PurchasesApi()

export default {
  name: 'applications',
  data: () => ({
    rowView: true,            
    filterDrawer: false,
    search: {
      searchText: new String(),
      date_from: '',
      date_to: '',
      statuses: []
    },
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
        if (this.search === '') {                        
          return this.$store.getters['purchases/getApplications']
        }

        return _.filter(this.$store.getters['purchases/getApplications'], this.searchCallback)
      },
      set: function(newVal) {
        this.$store.commit('purchases/setApplications', newVal)
      }
    },
    statuses: {
      get: function() {
        return this.$store.getters['purchases/getDocStatus']
      },
    }
  },
  methods: {
    searchCallback (item) {
      let titleResult = this.checkTitle(item)
      let numberResult = this.checkNumber(item)
      let dateResult = this.checkDates(item)
      let statusResult = this.checkStatus(item)
                                
      return (numberResult || titleResult) && dateResult && statusResult                
    },
    checkTitle(item) {
      var titleResult = true
      if (this.search.searchText != '') {
        var itemToSearch = _.lowerCase(_.trim(item.title))
        var searchedTitle = _.lowerCase(_.trim(this.search.searchText))
        var temp = itemToSearch.indexOf(searchedTitle)
        titleResult = temp >= 0
      }

      return titleResult
    },
    checkNumber(item) {
      var numberResult = true
      if (this.search.searchText != '') {           
        var searchedNumber = _.lowerCase(_.trim(this.search.searchText))
        var temp = item.number.indexOf(searchedNumber)
        numberResult = temp >= 0
      }

      return numberResult
    },
    checkStatus(item) {
      let result = true
      if (this.search.statuses.length > 0) {
        let docId = item.docStatus.id
        for (let i = 0;i < this.search.statuses.length;i++) {
          if (docId === this.search.statuses[i]) {
            result = true
            break
          } else {
            result = false
          }
                        
        }
      }

      return result
    },
    checkDates(item) {
      var result = true

      var itemDate = Date.parse(item.date)
      var dTo = Date.now()
      var dFrom = Date.now()

      if (this.search.date_from != '') {
        dFrom =  Date.parse(this.search.date_from)
        if (itemDate < dFrom) {
          result = false
        }
      }
      if (this.search.date_to != '') {
        dTo =  Date.parse(this.search.date_to)
        if (itemDate > dTo) {
          result = false
        }
      }
                
      return result
    },
    getItemsOnPage() {
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
  created() {            
    api.getDocStatus()
    api.getApplications()
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

.statuses{
    margin: 0;
    padding:0;
    color: blue;
}

</style>