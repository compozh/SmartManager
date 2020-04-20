<template>
  <v-menu close-on-click
          close-on-content-click
          offset-y
          transition="scroll-y-transition">

    <template v-slot:activator="{ on }">
      <v-btn icon v-on="on">{{ lang.flag }}</v-btn>
    </template>

    <v-list dense nav>

      <v-list-item v-for="locale in locales"
                   :key="locale.code"
                   @click="lang = locale.code">

        <v-list-item-title :class="{'primary--text': locale.code === lang.code}"
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
    locales: [
      { code: 'uk', name: 'Українська', flag: 'ua' },
      { code: 'ru', name: 'Русский', flag: 'ru' },
      { code: 'en', name: 'English', flag: 'en' }
    ]
  }),
  mixins: [folders],
  computed: {
    lang: {
      get () {
        return this.locales
          .find(lang => lang.code === this.$i18n.locale)
      },
      set (lang) {
        this.setLang(lang)
        // Перечитка папок для обновления локализации
        this.getFolders()
      }
    }
  },
  methods: {
    setLang (lang) {
      this.$vuetify.lang.current = lang
      this.$localization.SetLocalization(lang)
    }
  }
}
</script>

<style scoped>

</style>
