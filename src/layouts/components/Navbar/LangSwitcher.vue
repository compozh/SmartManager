<template>
  <v-menu close-on-click
          close-on-content-click
          offset-y
          transition="scroll-y-transition">

    <template #activator="{ on }">
      <v-btn icon small v-on="on">
        <span class="body-1">{{ lang.flag }}</span>
      </v-btn>
    </template>

    <v-list dense nav>

      <v-list-item v-for="locale in locales"
                   :key="locale.code"
                   @click="lang = locale.code">

        <v-list-item-title :class="{ 'body-1': true, 'primary--text': locale.code === lang.code}"
        >{{ locale.flag.toUpperCase() }} ({{ locale.name }})</v-list-item-title>

      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
import { folders } from '@/mixins/units'

export default {
  name: 'LangSwitcher',
  data: () => ({
    localesList: [
      { code: 'uk', name: 'Українська', flag: 'ua' },
      { code: 'en', name: 'English', flag: 'en' },
      { code: 'zh', name: 'Chinese', flag: 'zh' },
      { code: 'ru', name: 'Русский', flag: 'ru' }
    ]
  }),
  mixins: [folders],
  computed: {
    lang: {
      get () {
        let locale = this.locales
          .find(lang => lang.code === this.$i18n.locale)
        if (locale) return locale
        locale = this.locales[0]
        this.setLang(locale.code)
        return locale
      },
      set (lang) {
        this.setLang(lang)
      }
    },

    locales () {
      if (window.appConfig.lang) {
        const langs = window.appConfig.lang.split(',')
        return this.localesList.filter(locale => {
          return langs.some(lang => lang.trim() === locale.code)
        })
      }
      return this.localesList
    }
  },
  methods: {
    setLang (lang) {
      this.$vuetify.lang.current = lang
      this.$localization.SetLocalization(lang)
      // Перечитка папок для обновления локализации
      this.getFolders()
    }
  }
}
</script>
