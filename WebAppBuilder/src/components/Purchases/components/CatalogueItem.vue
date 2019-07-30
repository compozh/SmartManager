<template>
    <v-layout>
        <v-flex justify-start>
            <v-card v-if="item">
                <v-layout wrap>
                    <v-flex justify-start>
                        <item-picture height="400px" entityName="resources" :id="item.id"/>
                    </v-flex>
                    <v-flex>
                        <v-card class="card-info">
                            <v-card-title class="card-header">
                                <h3>{{item.name}}</h3>
                            </v-card-title>
                            <v-card-text>
                                <v-layout column>
                                    <v-flex>
                                        <p class="card-property">Группа:</p>
                                        <p class="card-property-value">{{ item.resourceGroup.name}} </p>
                                    </v-flex>
                                    <v-flex>
                                        <p class="card-property">Обозначение:</p>
                                        <p class="card-property-value">{{ item.id}} </p>
                                    </v-flex>
                                    <v-flex>
                                        <p class="card-property">Название ресурса:</p>
                                        <p class="card-property-value">{{ item.name}} </p>
                                    </v-flex>                                    
                                    <v-flex>
                                        <p class="card-property">Единица измерения:</p>
                                        <p class="card-property-value">{{item.measurementUnit.fullName}} </p>
                                    </v-flex>
                                </v-layout>
                            </v-card-text>
                            <v-card-actions>
                                <v-layout row>
                                    <v-flex lg1 xl1 justify-start>
                                        <favorite-btn :v-model="item" value="a" alias="DOC" :keyValue="item.id.toString()"/>
                                    </v-flex>     
                                    <v-flex lg1 xl1>
                                        <add2cart-btn :keyValue="item.id.toString()"/>
                                    </v-flex>                  
                                </v-layout>
                            </v-card-actions>
                        </v-card>
                    </v-flex>
                </v-layout>
            </v-card>
        </v-flex>
    </v-layout>
</template>

<script>
    import purchasesSchemaAxios from "../api/BaseFunctions";
    import {PurchasesApi} from "../api/purchasesApi";
    const api = new PurchasesApi();

    export default {
        name: "catalogue-item",
        data:() => ({
            item: {}
        }),
        props:{
            catalogueId: {
                required: true
            }
        },
        created: function(){
            api.getResourceById(this.catalogueId).then(this.respCallback);
        },
        methods:{
            respCallback (resp) {
                this.item = _.first(resp.data.purchases.resources);
            }
        }
    }
</script>

<style lang="scss" scoped>
    
    .card-info{
        box-shadow: none;
        margin: 10px;
        padding: 10px;
    }

    .card-header{
        min-height: 40px;
        border-bottom: 1px lightgray solid;
    }

    .card-property{
        float: left;
    }

    .card-property-value{
        float: left;
        color: gray;
        margin-left: 2.5em;
    }

    .add_button:hover{
        color: green;
    }
   
</style>

