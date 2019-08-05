<template>
    <v-container fluid v-if="applications">
        <v-navigation-drawer fixed right app v-model="filterDrawer" >
        <v-layout class="filter-panel">
          <v-flex>
            <label v-text="$t('purchases.Catalog.FastFilter')" />
            <v-card elevation="0">
                <v-card-text>
                    <v-text-field v-model="search.title" label="Титл" clearable />
                    <v-text-field v-model="search.number" label="Номер" clearable/>
                    <date-text-field editable="true" :dateType="this.search" fieldName="date_from"
                    labelName="С"/>
                    <date-text-field editable="true" :dateType="this.search" fieldName="date_to"
                    labelName="По"/>
                </v-card-text>
            </v-card>
            <v-card elevation="0">
                <v-card-title>
                    Статус
                </v-card-title>
                <v-card-text>
                    <template v-for="(item, index) in this.statuses">
                        <v-checkbox v-model="search.statuses" :label="item.name" :value="item.id" :key="index"/>
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
import moment from 'moment';
import {PurchasesApi} from "../api/purchasesApi";
const api = new PurchasesApi();

    export default {
        name: "applications",
        //props: ["applications"],
        data: () => ({
            rowView: true,            
            filterDrawer: false,
            search: {
                title: "",
                date_from: "",
                date_to: "",
                number: "",
                statuses: []
            },
            smallSize: true,
            pagination: {
                page: 1
            }
        }),
        filters:{
            formatDate: (value) => {
                if (value) {
                    return moment(String(value)).format('DD.MM.YYYY')
                }
            }
        },
        computed: {
            pages: {
                get() { 
                    return Math.ceil(this.applications.length / this.rowsPerPage);
                }
            },
            rowsPerPage: {
                get() {
                    return this.rowView ? 24 : 18;
                }
            },
            applications:{
                get: function() {
                    if(this.search === ""){                        
                        return this.$store.getters["purchases/getApplications"];
                    }

                    return _.filter(this.$store.getters["purchases/getApplications"], this.searchCallback);
                },
                set: function(newVal){
                    this.$store.commit('purchases/setApplications', newVal);
                }
            },
            statuses:{
                get: function() {
                    return this.$store.getters["purchases/getDocStatus"];
                },
            }
        },
        methods:{
            searchCallback (item) {
                var itemToSearch = _.lowerCase(item.title);
                var searchedTitle = _.lowerCase(_.trim(this.search.title));
                var searchedNumber = _.lowerCase(_.trim(this.search.number));               
                
                var temp = itemToSearch.indexOf(searchedTitle);
                var titleResult = temp >= 0;
                
                var numberResult = true;
                if(searchedNumber != ""){
                    numberResult = item.number === searchedNumber;
                }
                
                let dateResult = this.checkDates(item);
                let statusResult = this.checkStatus(item);
                
                
                //return numberResult && titleResult && dateResult && statusResult;
                return true;
            },
            checkStatus(item){
                let result = false;
                let docId = item.docStatus.id;
                for(let i=0;i<this.search.statuses.length;i++){
                    if(docId === this.search.statuses[i].id){
                        result = true;
                        break;
                    }
                }

                return result;
            },
            checkDates(item){
                var result = true;

                var itemDate = Date.parse(item.date);
                var dTo = Date.now();
                var dFrom = Date.now();

                if(this.search.date_from != ""){
                    dFrom =  Date.parse(this.search.date_from);
                    if(itemDate < dFrom){
                        result = false;
                    }
                }
                if(this.search.date_to != ""){
                    dTo =  Date.parse(this.search.date_to);
                    if(itemDate > dTo){
                        result = false;
                    }
                }
                
                return result;
            },
            getItemsOnPage(){
                return this.applications.slice(
                    (this.pagination.page - 1) * this.rowsPerPage, 
                    this.pagination.page * this.rowsPerPage)
            },
            sizeItemsFltr(){
                return this.sizeItems.filter(i=> this.$vuetify.breakpoint.mdAndUp || i.value != 3);
            },
            swipeLeft(appl){
                console.log(`TODO: swipe left for application #${appl.number}`)
            },
            swipeRight(appl){
                console.log(`TODO: swipe right for application #${appl.number}`)
            }
        },
        created() {
            api.getApplications();
            api.getDocStatus();
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