<template>
  <v-row no-gutters style="flex-basis: 0;"
         class="flex-grow-1">
    <v-col class="pa-0">
      <v-row dense align-content="start" justify="start">
        <v-col class="d-flex">
          <search-field class="mt-n3 ml-1"/>
          <v-spacer/>
        </v-col>
      </v-row>
      <case-cards :cases="cases"/>
    </v-col>
    <router-view/>
  </v-row>
</template>

<script>
import SearchField from '@/components/SearchField'
import CaseCards from './CaseCards'
import { zones, folders, cases } from '@/mixins/units'

export default {
  name: 'CaseList',
  mixins: [zones, folders, cases],
  components: {
    SearchField,
    CaseCards
  },
  created () {
    this.getCases()
  }
}
</script>

<style scoped>

</style>
