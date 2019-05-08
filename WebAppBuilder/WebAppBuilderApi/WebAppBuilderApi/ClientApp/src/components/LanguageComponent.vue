<template>
    <div class="text-xs-center">
        <v-menu offset-y>
          <template v-slot:activator="{ on }">
            <v-btn
              color="black"
              dark
              v-on="on"
              v-text="curentLanguage"
              flat
            >
            </v-btn>
          </template>
          <v-list>
            <v-list-tile
              v-for="(item, index) in dictionaryLanguage"
              :key="index"
              @click="SetLocale(index)"
            >
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
export default {
    name :"language-component",
    components:{
        CountryFlag
    },
    data(){
        return{
            arrayCountryAndFlag:[],
            dictionaryLanguage :[
                { name: "Беларуская", flag: "be", key: "BE" },
                { name: "Čeština", flag: "cz", key: "CS" },
                { name: "English", flag: "gb", key: "EN" },
                { name: "Eesti", flag: "ee", key: "ET" },
                { name: "Iran", flag: "ir", key: "FA" },
                { name: "Magyar", flag: "hu", key: "HU" },
                { name: "Polski", flag: "pl", key: "PL" },
                { name: "Русский", flag: "ru", key: "RU" },
                { name: "Українська", flag: "ua", key: "UK" },
                { name: "Chinese", flag: "cn", key: "ZH" },
            ],
            curlanguage : localStorage.getItem('curentLanguage') ? localStorage.getItem('curentLanguage') : "Русский"
        }
    },
    computed:{
        curentLanguage(){
            return this.curlanguage;
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
            this.curlanguage =this.dictionaryLanguage[index].name
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
    }
  },
}
</script>

<style>
/* Отступ от флагов */
    .country{
        padding-left: 10px;
    }
</style>
