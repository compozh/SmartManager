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
              v-for="(item, index) in arrayCountryAndFlag"
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
export default {
    name :"language-component",
    components:{
        CountryFlag
    },
    data(){
        return{
            arrayCountryAndFlag:[],
        }
    },
    computed:{
        dictionaryLanguage(){
        return this.$store.getters.getDictionarylanguage;
        },
        curentLanguage(){
        return this.$store.getters.getCurentLanguage;
        }
    },
    mounted(){

        this.ConverDictionaryToArray();
        //Если есть параметр в url
        if(this.$route.query.language){
            this.SetUpLanguageFromURLParameter();
        //Иначе берем из sessionStorage
        }else if(sessionStorage.getItem('language')){
            var language = sessionStorage.getItem('language')
            this.Setlocalization(language)
        }
    },
    methods:{
    //Изменяем локализацию через выбор элемента в списке
        SetLocale(index){
            var language = this.arrayCountryAndFlag[index].key.toLowerCase();
            this.$store.dispatch('SetCurentLanguage',this.arrayCountryAndFlag[index].name)
            this.$store.dispatch('SetLocalization', language)
            this.Setlocalization(language)
        },
    //Переобразовываю объекта в массив
    ConverDictionaryToArray(){
         for (var key in this.dictionaryLanguage){
            let obj = {
                name: this.dictionaryLanguage[key].name,
                flag: this.dictionaryLanguage[key].flag,
                key: key
            }
            this.arrayCountryAndFlag.push(obj)
        }
    },
    //Установка локализации из параметра в строке url
    SetUpLanguageFromURLParameter(){
        var language = this.$route.query.language.toUpperCase()
        this.$store.dispatch('SetCurentLanguage', this.dictionaryLanguage[language].name)
        this.$store.dispatch('SetLocalization', language.toLowerCase())
        this.Setlocalization(language.toLowerCase());
    },
    //Установка локализации
    Setlocalization(language){
        import(`../plugins/resources/${language}.json`).then((msg) =>{
            this.$i18n.setLocaleMessage(language, msg);
            this.$i18n.locale = language;
        })
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
