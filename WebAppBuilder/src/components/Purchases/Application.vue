<template>
    <div>
        <v-card v-if="application">
            <v-card-title class="headline">
                <v-layout column>
                    <workflow-stepper object="" keyvalue=""/>
                    Заявка № {{application.number}} от {{application.date | formatDate}}
                </v-layout>
            </v-card-title>
            <v-card-text>
                
                <!-- Строки документа -->
                <template v-for="row in compRows">
                    <v-card :key="row.id">
                        <v-layout row-card>
                            <v-flex class="element-margin">
                                <resource-autocomplete 
                                    :editable="row.isEdit" 
                                    :resource="row.resource"
                                />
                            </v-flex>
                            <v-flex class="element-margin" md2 lg1>
                                <quantity-text-field 
                                    :editable="row.isEdit" 
                                    :quantityType="row" 
                                    fieldName="planQuantity" 
                                />
                            </v-flex>
                            <v-flex class="element-margin" md1>
                                <measurement-autocomplete 
                                    :editable="row.isEdit" 
                                    :measurement="row.measurementUnit"
                                />
                            </v-flex>
                            <v-flex class="element-margin" md2>
                                <date-text-field 
                                    :editable="row.isEdit" 
                                    :dateType="row" 
                                    fieldName="orderDate"
                                />
                            </v-flex>
                            <v-btn class="button-margin" v-if="row.isEdit" icon>
                                <v-icon color="error">delete</v-icon>
                            </v-btn>
                            <v-btn class="button-margin" icon @click="editClick(row)">
                                <v-icon color="primary" >
                                    {{row.isEdit ? 'save' : 'edit'}}
                                </v-icon>
                            </v-btn>
                        </v-layout>
                    </v-card>
                </template>
            </v-card-text>
            <v-card-actions> </v-card-actions>
        </v-card>
    </div>
</template>

<script>
import moment from 'moment';
import _ from 'lodash';

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
.element-margin{
    margin: 2px;
}
.button-margin{
    margin-top: 15px;
}
</style>