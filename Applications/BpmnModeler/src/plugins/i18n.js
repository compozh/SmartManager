import Vue from 'vue';
import VueI18n from 'vue-i18n';

Vue.use(VueI18n);

// const defaultLang = 'ru';
let language = window.navigator ? (window.navigator.language ||
  window.navigator.systemLanguage ||
  window.navigator.userLanguage) : 'ru';
language = language.substr(0, 2).toLowerCase();

export const currentLang = () => {
  if (localStorage.language) {
    return localStorage.language;
  }
  localStorage.language = language;
  return language;
};

export const i18n = new VueI18n({
  silentTranslationWarn: process.env.NODE_ENV === 'production',
  locale: currentLang()
});