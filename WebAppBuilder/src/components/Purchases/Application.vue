<template>
    <div>
        <v-card>
            <v-card-title class="headline">
                <v-layout column>
                    <workflow-stepper object="" keyvalue=""/>
                    Заявка № {{application.number}} от {{application.date | formatDate}}
                </v-layout>
            </v-card-title>
            <v-card-text>
                
                <!-- Строки документа -->
                <template v-for="row in application.rows">
                    <v-card :key="row.id">
                        <v-layout row-card>
                            <v-flex>
                                <v-autocomplete 
                                    v-model="row.resource"
                                    :loading="resourceComp[row.id].loading"
                                    :items="resourceItemsComp"
                                    :search-input.sync="searchComp.resources[row.id]"
                                    cache-items
                                    hide-no-data
                                    hide-details
                                    label="Ресурс"
                                    return-object
                                    item-text="fullName"
                                    clearable  
                                />
                            </v-flex>
                            <v-flex>
                                <v-autocomplete
                                    v-model="row.measurementUnit"
                                    :loading="measurementComp[row.id].loading"
                                    :items="measurementItemsComp"
                                    :search-input.sync="searchComp.measurementUnits[row.id]"
                                    cache-items
                                    hide-no-data
                                    hide-details
                                    label="Единица измерения"
                                    return-object
                                    item-text="name"
                                    clearable  
                                />
                            </v-flex>
                            <v-btn icon>
                                <v-icon color="error">delete</v-icon>
                            </v-btn>
                            <v-btn icon>
                                <v-icon color="primary" @click="editRecord()">edit</v-icon>
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
import axios from "axios";
import moment from 'moment';
import _ from 'lodash';

    export default {
        name: "application",
        props: ["applicationId","application"],
        data:()=>({
          resource: undefined,
          measurement: undefined,
          resourceItems: [],
          measurementItems: [],
          searchOld: undefined,
          search: undefined,
          COMPONENT_TYPES: {
              RESOURCES: "resources",
              MEASUREMENTS: "measurementUnits",

          }
        }),
        filters:{
            formatDate: (value) => {
                if (value) {
                    return moment(String(value)).format('DD.MM.YYYY')
                }
            }
        },
        watch: {
            search: {
                handler(val, oldVal) {
                    if (!val || !this.searchOld || JSON.stringify(val) == JSON.stringify(this.searchOld)){
                        return;
                    }

                    var name = "";
                    var items = [];
                    var object = null;
                    var query = "";

                    for (const key in this.COMPONENT_TYPES) {
                        if (this.COMPONENT_TYPES.hasOwnProperty(key)) {
                            const element = this.COMPONENT_TYPES[key];
                            if (!val[element] || !this.searchOld[element] || 
                                JSON.stringify(val[element]) != JSON.stringify(this.searchOld[element])){
                                name = element;
                            }
                        }
                    }

                    var id = 0;
                    var v = "";
                    for (const key in val) {
                        if (val.hasOwnProperty(key)) 
                        {
                            const el1 = val[key];
                            const el2 = this.resourceSearchOld[key];
                            if (el1 != el2){
                                id = key;
                                v = el1;
                                break;
                            }
                        }
                    }

                    switch (name) {
                        case this.COMPONENT_TYPES.RESOURCES:
                            name = element;
                            items = this.resourceItems;
                            object = this.resource[id];
                            query = `{ purchases { resources (where:{path:"name" comparison:like  value:"%${v}%"}){fullName,id}}}`;
                            break;
                    
                        case this.COMPONENT_TYPES.MEASUREMENTS:
                            name = element;
                            items = this.measurementItems;
                            object = this.measurement[id];
                            query = `{purchases{measurementUnits(where:[{path:"isValid",comparison:equal,value:"true"},{path:"name",comparison:like,value:"%${v}%"}]){id,name}}}`;
                            break;
                    }

                    this.resourceSearchOld = val.slice();
                    debugger;
                    this.querySelections(query,object,items,name)
                },
                deep: true
            },
        },
        methods:{
            async querySelections (query, obj, items, name) {
                //debugger;
                obj.loading = true
                clearTimeout(obj.timeout);
                this.timeout = setTimeout(() => {
                    axios({
                        method: 'POST',
                        url: myConfig.GrapgQlUrl+'api/graphql',
                        withCredentials:true,
                        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('ItUniTocken')},
                        data: { 
                            SchemaName:'PurchasesSchema', 
                            query: query
                        } 
                    }).then(resp => {
                        console.log( resp.data );
                        if (resp.data.data.purchases[name].length > 0)
                        {
                            items = _.uniqBy([...items, ...resp.data.data.purchases[name]], "id");
                        }
                    });
                }, 0)
                obj.loading = false;
            },
        },
        computed: {
            resourceComp() {
                if (!this.resource){
                   this.resource = _.transform(_.orderBy(this._props.application.rows,"id"), function (accu, val) {
                        accu[val.id] = { timeout: 0, loading: false };
                    }, [])
                }
                return this.resource;
            },
            measurementComp() {
                if (!this.measurement){
                    this.measurement = _.transform(_.orderBy(this._props.application.rows,"id"), function (accu, val) {
                        accu[val.id] = { timeout: 0, loading: false };
                    }, [])
                }
                return this.resource;
            },
            resourceItemsComp() {
                this.resourceItems = this.resourceItems.length > 0 ? this.resourceItems : _.uniqBy(this._props.application.rows.map(r=>r.resource), "id");
                return this.resourceItems;
            },
            measurementItemsComp() {
                this.measurementItems = this.measurementItems.length > 0 ? this.measurementItems : _.uniqBy(this._props.application.rows.map(r=>r.measurementUnit), "id");
                return this.measurementItems;
            },
            searchComp() {
                for (const key in this.COMPONENT_TYPES) {
                    if (this.COMPONENT_TYPES.hasOwnProperty(key)) {
                        const element = this.COMPONENT_TYPES[key];
                        if (!this.search){
                            this.search = {};
                        }
                        if (!this.search[element]){
                            this.search[element] = _.transform(_.orderBy(this._props.application.rows,"id"), function (accu, val) {
                                accu[val.id] = "";
                            }, []);
                            if (!this.searchOld)
                            {
                                this.searchOld = {}
                            }
                            this.searchOld[element] = this.search[element].slice();
                            
                        }
                    }
                }
                return this.search;
            }
        }
    }
</script>

<style>
.row-button-delete{
    width: 20px;
}
.row-card{
    margin: 2px;
}
</style>