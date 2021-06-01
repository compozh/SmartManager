<template>
  <v-row no-gutters style="flex-basis: 0;"
         class="flex-grow-1 overflow-hidden">
    <v-col class="d-flex flex-column fill-height pa-0">
      <v-row dense justify="start"
             align-content="start"
             class="flex-grow-0">
        <v-col class="d-flex py-2">
          <search-field :class="`mt-n3 ${ml}-1`"/>
          <v-spacer/>
        </v-col>
      </v-row>
      <case-cards :cases="cases"/>
    </v-col>
    <router-view/>
  </v-row>
</template>

<script>
import { zones, folders, cases } from '@/mixins/units'

const SearchField = () => import('@/components/SearchField')
const CaseCards = () => import('./CaseCards')

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
