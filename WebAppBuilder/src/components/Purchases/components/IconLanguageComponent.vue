<template>
    <div >
        <v-menu offset-y>
          <template v-slot:activator="{ on }">
            <v-btn  v-on="on" flat icon>
                {{curentLanguageText}}
                <!-- <country-flag :country='curentLanguageFlag' size='normal'/> -->
            </v-btn>
          </template>
          <v-list>
            <v-list-tile
              v-for="(item, index) in dictionaryLanguage"
              :key="index"
              @click="SetLocale(index)">
              <country-flag :country='item.flag' size='small'/>
              <v-list-tile-title class="country">   {{ item.name }}</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
  </div>
</template>

<script>
import CountryFlag from 'vue-country-flag'
import _ from "lodash"
import { debug } from 'util';
import {PurchasesApi} from "../api/purchasesApi";
    
const api = new PurchasesApi();

export default {
    name :"icon-language-component",
    components:{
        CountryFlag
    },
    data(){
        return{
            arrayCountryAndFlag:[],
            dictionaryLanguage :[
                { name: "English",    flag: "gb", key: "EN", label:"Eng" },
                { name: "Русский",    flag: "ru", key: "RU", label:"Рус" },
                { name: "Українська", flag: "ua", key: "UK", label:"Укр" },
            ],
            curlanguage : localStorage.getItem('curentLanguage') ? localStorage.getItem('curentLanguage') : "Русский"
        }
    },
    computed:{
        curentLanguageFlag(){
            return _.find(this.dictionaryLanguage,["name", this.curlanguage]).flag;
        },
        curentLanguageText(){
            return _.find(this.dictionaryLanguage,["name", this.curlanguage]).label;
        }
    },
    mounted(){
        //Если есть параметр в url
        if(this.$route.query.language){
            this.SetUpLanguageFromURLParameter();
        //Иначе берем из sessionStorage
        }else if(localStorage.getItem('language')){
            var language = localStorage.getItem('language')
            this.Setlocalization(language)
        }
    },
    methods:{
    //Изменяем локализацию через выбор элемента в списке
        SetLocale(index){
            var language = this.dictionaryLanguage[index].key.toLowerCase();
            this.curlanguage = this.dictionaryLanguage[index].name
            localStorage.setItem('curentLanguage', this.curlanguage)
            localStorage.setItem('language', language);

            this.Setlocalization(language)
        },
    //Установка локализации из параметра в строке url
    SetUpLanguageFromURLParameter(){
        var language = this.$route.query.language.toUpperCase()
        this.curlanguage = _.find(this.dictionaryLanguage, function(o){return o.key == language}).name
        localStorage.setItem('curentLanguage', this.curlanguage)
        localStorage.setItem('language', language.toLowerCase())
        this.Setlocalization(language.toLowerCase());
    },
    //Установка локализации
    Setlocalization(language){
       this.$i18n.Setlocalization(language);       
       this.$cookies.set("c", language.toUpperCase()); 
       let currentGroup = this.$route.params.catalogueId;
       if(currentGroup != undefined){
           api.getBreadcrumbsByGroup(currentGroup,true);
           api.getResourcesGroupById(currentGroup);
        }
       else{
            api.restoreGraphCache();
            api.getResourcesGroupsByParentGroup("");
       }
    }

  },
}
</script>

<style lang="scss" >
    .v-btn__content{
        height: inherit;
    }
</style>

<style lang="scss" scoped>
    .v-btn__content{
        height: inherit;
    }
    .flag_button{
        height: inherit;
    }
    /* Отступ от флагов */
    .country{
        padding-left: 10px;
    }
</style>
