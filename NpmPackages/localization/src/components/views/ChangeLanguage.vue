<template>
  <div class="text-xs-center">
    <ChangeLanguage :currentLanguage="currentLanguage">
       <v-menu offset-y slot-scope="props">
        <template v-slot:activator="{ on }">
          <v-btn color="black" dark v-on="on" v-text="props.currentLanguageName" flat></v-btn>
        </template>
        <v-list>
          <v-list-tile
            v-for="(item, index) in props.allLanguages"
            :key="index"
            @click="props.languageListEvents.click(index)"
          >
            <country-flag :country="item.flag" size="small" />
            <v-list-tile-title class="country">{{ item.name }}</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
    </ChangeLanguage>
  </div>
</template>

<script>
import ChangeLanguage from '../renderless/ChangeLanguage'
import CountryFlag from 'vue-country-flag'

export default {
  components: {
    ChangeLanguage,
    CountryFlag
  },
  props: {
    currentLanguage: {}
  }

}
</script>

<style>
/* Отступ от флагов */
.country {
  padding-left: 10px;
}
</style>
