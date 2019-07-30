<template>
    <v-container fluid>
        <v-layout wrap>
            <v-flex xs12 sm12 md12 lg12 xl12>
                <v-card v-if="application">
                    <esecute-stepper :currentStage="application.docStatus.sortOrder" :minimalistStyle ="false"/>
                    <v-card-title class="headline">
                        <v-layout column>
                            {{$t('purchases.CartItems.Application')}} № {{application.number}} от {{application.date | formatDate}}
                        </v-layout>
                    </v-card-title>
                    <v-card-text>                                
                        <template v-for="row in compRows">
                            <v-card class="application_cart" :key="row.id">                    
                                <v-layout wrap row>
                                    <v-flex xl5 lg5 md12 sm12 xs12>
                                        <resource-autocomplete
                                            :labelName="$t('purchases.CartItems.Resource')"
                                            :editable="row.isEdit" 
                                            :resource="row.resource"
                                        />
                                    </v-flex>
                                    <v-flex lg2 xl2 md6 sm6 xs6>
                                        <quantity-text-field 
                                            :labelName="$t('purchases.CartItems.Quantity')"
                                            :editable="row.isEdit" 
                                            :quantityType="row" 
                                            fieldName="planQuantity" 
                                        />
                                    </v-flex>
                                    <v-flex lg2 xl2 md6 sm6 xs6>
                                        <measurement-autocomplete
                                            :labelName="$t('purchases.CartItems.Unit')"
                                            :editable="row.isEdit" 
                                            :measurement="row.measurementUnit"
                                        />
                                    </v-flex>
                                    <v-flex lg2 xl2 md12 sm12 xs12>
                                        <date-text-field 
                                            :labelName="$t('purchases.CartItems.Date')"
                                            :editable="row.isEdit" 
                                            :dateType="row"
                                            fieldName="orderDate"
                                        />
                                    </v-flex>
                                    <v-flex justify-center  lg1 xl1 md12 sm12 xs12>
                                        <v-btn class="button-margin" v-if="row.isEdit" icon>
                                            <v-icon color="error">delete</v-icon>
                                        </v-btn>
                                        <v-btn class="button-margin" icon @click="editClick(row)">
                                            <v-icon color="primary" >
                                                {{row.isEdit ? 'save' : 'edit'}}
                                            </v-icon>
                                        </v-btn>
                                    </v-flex>
                                </v-layout>
                            </v-card>
                        </template>     
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import moment from 'moment';
import _ from 'lodash';
import {PurchasesApi} from "../api/purchasesApi";

const api = new PurchasesApi();


export default {
    
    name: "application",
    props: { 
        applicationId: undefined,
        //applicationItemId: undefined
    },
    filters:{
        formatDate: (value) => {
            if (value) {
                return moment(String(value)).format('DD.MM.YYYY')
            }
        }
    },
    computed:{
        application:{
            get: function() {
                debugger;
                let test = this.$store.getters["purchases/getApplications"];
                return test.find(w=>w.id == this.$route.params.applicationId);
            },
            set: function(newVal){
                debugger;
                //this.$store.commit('purchases/setApplications', newVal);
            }
        },
        compRows() {
            for (const key in this.application.rows) {
                if (this.application.rows.hasOwnProperty(key)) {
                    if (this.application.rows[key].isEdit == undefined)
                    {
                        this.$set(this.application.rows[key], 'isEdit', false)
                    }
                }
            }
            return this.application.rows;
        }
    },
    created(){
        debugger;
    },
    mounted(){
        api.getApplications();
    },
    methods:{
        editClick(row){
            console.log(row);
            row.isEdit = !!!row.isEdit;
        }
    },
    watch: {
        '$route' (to, from) {
          debugger;
          var id = to.params.applicationItemId;
          this.application = id ;
        }
      }
}
</script>

<style scoped>
    .application_cart{
        margin-top: 10px;
        background-color: aliceblue;
    }
</style>