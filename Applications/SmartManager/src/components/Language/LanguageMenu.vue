<template>
  <div>
    <v-menu offset-y left>
      <template v-slot:activator="{ on }">
        <v-btn flat v-on="on" class="lang-btn">
          <country-flag :country='currentLocalization.flag'/>
        </v-btn>
      </template>
      <v-list>
        <v-list-tile
          v-for="(localization, index) in localizations"
          :key="index"
          @click="setLocalization(localization.key)">
          <country-flag :country='localization.flag' size='small'/>
          <v-list-tile-title class="country"> {{ localization.name }}</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
import countryFlag from 'vue-country-flag'

export default {
  name: 'language-menu',
  components: {
    countryFlag
  },
  data: () => ({
    currentLocalization: {},
    localizations: [
      {name: 'English', flag: 'gb', key: 'en'},
      {name: 'Русский', flag: 'ru', key: 'ru'},
      {name: 'Українська', flag: 'ua', key: 'uk'}
    ]
  }),
  created() {
    this.getLocalization()
  },
  methods: {
    getLocalization() {
      this.currentLocalization = this.localizations
        .find(i => i.key === localStorage.language)
    },
    setLocalization(lang) {
      localStorage.language = lang
      this.$localization.Setlocalization(lang)
      this.getLocalization()
    }
  }
}
</script>

<style scoped>
  .lang-btn.v-btn {
    margin: 0 20px 0 0;
    padding: 0;
    min-width: 0;
  }

  .lang-btn.v-btn,
  .lang-btn.v-btn >>> .v-btn__content {
    height: 21px;
  }

  .v-list {
    padding: 0;
  }

  .v-list >>> .v-list__tile {
    height: 30px;
    font-size: 14px;
    padding: 0 10px;
  }

  .v-list >>> .v-list__tile span {
    margin-right: -13px;
  }
</style>
