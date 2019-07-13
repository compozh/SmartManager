import _ from 'lodash'
const allLanguages = [
  { name: 'Беларуская', flag: 'be', key: 'BE' },
  { name: 'Čeština', flag: 'cz', key: 'CS' },
  { name: 'English', flag: 'gb', key: 'EN' },
  { name: 'Eesti', flag: 'ee', key: 'ET' },
  { name: 'Iran', flag: 'ir', key: 'FA' },
  { name: 'Magyar', flag: 'hu', key: 'HU' },
  { name: 'Polski', flag: 'pl', key: 'PL' },
  { name: 'Русский', flag: 'ru', key: 'RU' },
  { name: 'Українська', flag: 'ua', key: 'UK' },
  { name: 'Chinese', flag: 'cn', key: 'ZH' }
]

export default {
  name: 'ChangeLanguageRl',
  render(){
    return this.$scopedSlots.default({
      currentLanguageName: this.currentLanguageName,
      allLanguages,
      languageListEvents: {
        click: this.SetLocale
      }
    })
  },

  props: {
    currentLanguage: {
      type: String,
      required: true
    }
  },
  data(){
    return {
      internalCurrentLanguage: undefined,
      nm: '',
    }
  } ,
  mounted() {
    let t=this
    setInterval(()=>{
      t.nm+='1'
    }, 1000)
    this.internalCurrentLanguage = this.currentLanguage
    //Если есть параметр в url
    if (this.$route.query.language) {
      this.SetUpLanguageFromURLParameter()
      //Иначе берем из sessionStorage
    } else if (localStorage.getItem('curentLanguage')) {
      this.internalCurrentLanguage = localStorage.getItem('curentLanguage')
      this.Setlocalization()
    }
  },
  computed: {
    currentLanguageName(){
      let lang = this.internalCurrentLanguage || this.currentLanguage
      return _.find(allLanguages, function(o) {
        return o.key.toLowerCase() == lang.toLowerCase()
      }).name
    }
  },
  methods: {
    //Изменяем локализацию через выбор элемента в списке
    SetLocale(index) {
      this.internalCurrentLanguage = allLanguages[index].key.toLowerCase()
      localStorage.setItem('curentLanguage', this.internalCurrentLanguage)
      this.Setlocalization()
    },
    //Установка локализации из параметра в строке url
    SetUpLanguageFromURLParameter() {
      this.internalCurrentLanguage = this.$route.query.language.toUpperCase()
      localStorage.setItem('curentLanguage', this.internalCurrentLanguage)
      this.Setlocalization()
    },
    //Установка локализации
    Setlocalization() {
      this.$localization.Setlocalization(this.internalCurrentLanguage)
    }
  }
}


