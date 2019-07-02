import Vue from 'vue'
import VueI18n from 'vue-i18n'
import ru from './resources/ru.json'
Vue.use(VueI18n)

const defLang = "ru"
let lang = localStorage.getItem('language') || defLang //дефолтный

export const i18n = new VueI18n({
    locale: lang,
    fallbackLocale: defLang,//если не загрузился язык, то ru
    messages:{
        ru
    },
})

i18n.Setlocalization = function(language){
  import(`../plugins/resources/${language}.json`).then((msg) =>{
      i18n.setLocaleMessage(language, msg);
      i18n.locale = language;
  })
}

if(lang != defLang){
  i18n.Setlocalization(lang)
}

