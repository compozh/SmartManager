<template>
    <v-layout justify-end>
        <v-autocomplete 
            v-show="showSearch" 
            @blur="hideSearch"
            id="elastic_search_input" ref="elastic_search_input"
            v-model="model"
            :loading="loading"
            :items="items"
            item-value="id"
            item-text="fullName"  
            :search-input.sync="search"
            cache-items
            hide-no-data
            hide-details
            :value-comparator="textCompare"
        >
            <template slot = "item" slot-scope="data">
                <v-btn icon @click.stop="alert(data.item.fullName)">
                    <v-icon>add_shopping_cart</v-icon> 
                </v-btn>
                <span v-text="data.item.fullName"></span>
            </template>
        </v-autocomplete>
        <v-icon v-show="!showSearch" @click="toogleSearchPanel">
            search
        </v-icon>
    </v-layout>
</template>

<script>
import Axios from "axios";

    export default {
        name:"elastic-search",
        data:()=> ({
            showSearch: false,

            loading: false,
            items: [],
            search: null,
            model: null,
            select: null,
            timeout: 0
        }),
        watch: {
            search (val) {
                //console.log(val);
                val && val.length > 3 && val !== this.select && this.querySelections(val)
            }
        },
        methods:{
            toogleSearchPanel(){
                this.showSearch = true;
                this.$refs.elastic_search_input.$el.focus()
            },
            hideSearch(){
                this.showSearch = false;
            },
            querySelections (v) {
                this.loading = true
                // Simulated ajax query
                clearTimeout(this.timeout);
                this.timeout = setTimeout(() => {
                Axios({
                    method: 'POST',
                    url: myConfig.GrapgQlUrl+'api/graphql',
                    withCredentials:true,
                    headers: { 'Authorization': 'Bearer ' + localStorage.getItem('ItUniTocken')},
                    data: { 
                        SchemaName:'PurchasesSchema', 
                        query: `{ purchases { resources (name:"%${v}%"){fullName,id}}}`
                    } 
                }).then(resp => {
            // тут обработка результата
                    //debugger;
                    console.log( resp.data );
                    this.items = resp.data.data.purchases.resources;
                    //console.log(resp.data) 
                },
                resp=> {
                    debugger;
                });
                this.loading = false
                }, 0)
            },
            textCompare(a1,a2){
                debugger;

                return true;
            }
        }
    }
</script>

<style scoped>
    .elastic-search-autocomplete input{
        align-self: center;
        justify-self: center;
    }
    .v-toolbar__content>:nth-last-child(3){
        justify-content: flex-end;
        margin-left: 100px;
    }
    .v-toolbar__content>:nth-last-child(2){
        max-width: 10px;
    }
</style>