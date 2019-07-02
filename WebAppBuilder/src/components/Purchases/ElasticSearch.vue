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
            :search-input.sync="search"
            cache-items
            hide-no-data
            hide-details
            no-filter
            autofocus
        >
            <template slot = "item" slot-scope="data">
                <v-layout>
                    <v-btn icon @click.stop="alert(data.item.caption)">
                        <v-icon>add_shopping_cart</v-icon> 
                    </v-btn>
                    <v-layout column justify-start>
                        <v-layout v-html="data.item.caption" />
                        <v-layout class="subcaption" v-html="data.item.additionalCaption" />
                    </v-layout>
                </v-layout>
                <!-- <span>{{ data.item.caption }}</span> -->
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
                val && val.length > 4 && val !== this.select && this.querySelections(val)
            }
        },
        methods:{
            toogleSearchPanel(){
                this.showSearch = true;
                this.$refs.elastic_search_input.$el.focus();
                this.items = [];
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
                        query: ` {purchases{elasticResourceNameSearch(name:"${v}")}}`
                        //query: `{ purchases { resources (name:"${v}"){fullName,id}}}`
                    } 
                }).then(resp => {
            // тут обработка результата
                    //debugger;
                    //console.log( resp.data );
                    this.items = _.map(JSON.parse(resp.data.data.purchases.elasticResourceNameSearch), function (item) 
                    { 
                        var ret = { id : item.Id };
                        var h = item.Highlights;
                        ret.caption = h.n_res ? h.n_res.Highlights[0] : item.Source.FullName;
                        ret.additionalCaption = h.nmat ? h.nmat.Highlights[0] : h.naimkm_s ? h.naimkm_s.Highlights[0] : h.n_res ? h.naimkm_s.Highlights[0] : "";
                        
                        return ret;
                    });
                    console.log(this.items);
                },
                resp=> {
                    debugger;
                });
                this.loading = false
                }, 0)
            }
            // :filter="textCompare"
            // textCompare(item, queryString, itemText){
            //     const charsCount = 66;
            //     const enMap = [ 
            //         '`', '~',
            //         'q', 'Q', 'w', 'W', 'e', 'E', 'r', 'R', 't', 'T', 'y', 'Y', 'u', 'U', 'i', 'I', 'o', 'O', 'p', 'P', '[', '{', ']', '}',
            //         'a', 'A', 's', 'S', 'd', 'D', 'f', 'F', 'g', 'G', 'h', 'H', 'j', 'J', 'k', 'K', 'l', 'L', ';', ':', '\'', '"', 
            //         'z', 'Z', 'x', 'X', 'c', 'C', 'v', 'V', 'b', 'B', 'n', 'N', 'm', 'M', ',', '>', '.', '<' ];
            //     const ruMap = [ 
            //         'ё', 'Ё',
            //         'й', 'Й', 'ц', 'Ц', 'у', 'У', 'к', 'К', 'е', 'Е', 'н', 'Н', 'г', 'Г', 'ш', 'Ш', 'щ', 'Щ', 'з', 'З', 'х', 'Х', 'ъ', 'Ъ',
            //         'ф', 'Ф', 'ы', 'Ы', 'в', 'В', 'а', 'А', 'п', 'П', 'р', 'Р', 'о', 'О', 'л', 'Л', 'д', 'Д', 'ж', 'Ж', 'э', 'Э',
            //         'я', 'Я', 'ч', 'ч', 'с', 'С', 'м', 'М', 'и', 'И', 'т', 'Т', 'ь', 'Ь', 'б', 'Б', 'ю', 'Ю' ];
            //     const ukMap = [ 
            //         '\'', '₴',
            //         'й', 'Й', 'ц', 'Ц', 'у', 'У', 'к', 'К', 'е', 'Е', 'н', 'Н', 'г', 'Г', 'ш', 'Ш', 'щ', 'Щ', 'з', 'З', 'х', 'Х', 'ї', 'Ї',
            //         'ф', 'Ф', 'і', 'І', 'в', 'В', 'а', 'А', 'п', 'П', 'р', 'Р', 'о', 'О', 'л', 'Л', 'д', 'Д', 'ж', 'Ж', 'є', 'Є',
            //         'я', 'Я', 'ч', 'ч', 'с', 'С', 'м', 'М', 'и', 'И', 'т', 'Т', 'ь', 'Ь', 'б', 'Б', 'ю', 'Ю' ];
                
            //     var queryChars = queryString.split('');
            //     var queryText = { En = "", Ru = "", Uk = "" };

            //     for (let char = 0; char < charsCount; char++) {
            //         const element = queryChars[char];
            //         var elNum = Math.max(_.findIndex(enMap, element), _.findIndex(ruMap, element), _.findIndex(ukMap, element));
            //         queryText.En += enMap[elNum];
            //         queryText.Ru += ruMap[elNum];
            //         queryText.Uk += ukMap[elNum];
            //     }
                
            //     return  itemText.toLowerCase().includes(queryText.En.toLowerCase()) || 
            //             itemText.toLowerCase().includes(queryText.Ru.toLowerCase()) || 
            //             itemText.toLowerCase().includes(queryText.Uk.toLowerCase());
            // }
        }
    }
</script>

<style>
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
    .highlit-elastic {
        display: inline-flex;
        background-color: antiquewhite;
        font-weight: 500;
        padding: 0px 3px 0px 3px;
    }
    .subcaption {
        font-size: small;
        color: darkgray;
    }
</style>