const state = {
  applicationDescription:{},
  appData: {},
  dictionaryLanguage :{
    BE: { name: "Беларуская", flag: "be" },
    CS: { name: "Čeština", flag: "cz" },
    EN: { name: "English", flag: "gb" },
    ET: { name: "Eesti", flag: "ee" },
    FA: { name: "Iran", flag: "ir" },
    HU: { name: "Magyar", flag: "hu" },
    PL: { name: "Polski", flag: "pl" },
    RU: { name: "Русский", flag: "ru" },
    UK: { name: "Українська", flag: "ua" },
    ZH: { name: "Chinese", flag: "cn" },
  },
  curentLanguage : sessionStorage.getItem('curentLanguage') ? sessionStorage.getItem('curentLanguage') : 'Русский',
  // Текущий пользователь
  currentuser: localStorage.getItem('userName')

};
export default state