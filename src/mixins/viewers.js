import { L10n } from '@syncfusion/ej2-base'

export default {
  computed: {
    locale () {
      return this.$i18n.locale
    }
  },
  watch: {
    locale (newLocale, oldLocale) {
      if (newLocale !== oldLocale) {
        this.setLocale(this.$options.name, this.localization)
      }
    }
  },
  created () {
    this.setLocale(this.$options.name, this.localization)
  },
  methods: {
    setLocale (component, localization) {
      L10n.load({
        [this.locale]: {
          [component]: this.$t(localization)
        }
      })
    }
  }
}
