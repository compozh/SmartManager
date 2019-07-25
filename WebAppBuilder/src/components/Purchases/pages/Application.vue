<template>
    <v-container fluid>
        <v-layout wrap>
            <v-flex xs12 sm12 md12 lg12 xl12>
                <v-card v-if="application">
                    <v-card-title class="headline">
                        <v-layout column>
                            <workflow-stepper :stageName="$t('purchases.CartItems.Stage')"/>
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
        applicationId: 0,
        application: {}
    },
    filters:{
        formatDate: (value) => {
            if (value) {
                return moment(String(value)).format('DD.MM.YYYY')
            }
        }
    },
    computed:{
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
    methods:{
        editClick(row){
            console.log(row);
            row.isEdit = !!!row.isEdit;
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