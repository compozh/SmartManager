<template>
    <div>
        <v-card>
            <v-card-media>
                <workflow-stepper object="" keyvalue=""/>
            </v-card-media>
            <v-card-title class="headline">
                Заявка № {{application.number}} от {{application.date | formatDate}}
            </v-card-title>
            <v-card-text>
                
                <!-- Строки документа -->
                <template v-for="row in application.rows">
                    <v-card :key="row.id">
                        <v-card-media>
                            <v-autocomplete
                                v-model="row.resource"
                                :loading="loading"
                                :items="[...items, row.resource]"
                                :search-input.sync="search"
                                cache-items
                                hide-no-data
                                hide-details
                                label="Единица измерения"
                                return-object
                                item-text="fullName"  
                            />
                        </v-card-media>
                    </v-card>
                </template>
            </v-card-text>
            <v-card-actions> </v-card-actions>
        </v-card>
    </div>
</template>

<script>
import moment from 'moment';
    export default {
        name: "application",
        props: ["applicationId","application"],
        data:()=>({
          loading: false,
          items: [],
          search: null,
          select: null
        }),
        filters:{
            formatDate: (value) => {
                if (value) {
                    return moment(String(value)).format('DD.MM.YYYY')
                }
            }
        },
        watch: {
            search (val) {
                val && val !== this.select && this.querySelections(val)
            }
        },
        methods:{
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
                        query: `{ purchases { resources (where:{path:"name" comparison:like  value:"%${v}%"}){fullName,id}}}`
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
        }
    }
</script>

<style>

</style>