import Vue from 'vue';
import VueI18n from 'vue-i18n';
import ru from './resources/ru.json';
import en from './resources/en.json';
import uk from './resources/uk.json';

Vue.use(VueI18n);

const defaultLang = 'ru';

export const currentLang = () => {
  if (localStorage.language) {
    return localStorage.language;
  }
  localStorage.language = defaultLang;
  return defaultLang;
};

export const i18n = new VueI18n({
  silentTranslationWarn: true,
  locale: currentLang(),
  messages: {
    ru: { bpmn: ru },
    en: { bpmn: en },
    uk: { bpmn: uk }
  }
});