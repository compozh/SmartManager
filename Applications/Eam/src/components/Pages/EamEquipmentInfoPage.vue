<template>
  <v-container :class="{'ma-0 pa-1': $vuetify.breakpoint.xs}">
    <v-layout v-if="item && item.id" column>
      <eam-equipment-main-info-card :item="item" />
      <eam-work-requests-table :constantFilter="workrequestFilter" />
      <eam-inspections-table />
    </v-layout>
    <v-alert v-else-if="!loading" icon="warning" value="true">Оборудование не найдено</v-alert>
  </v-container>
</template>

<script>
import { SINGLE_EQUIPMENT_INFO } from '../../api/eam-queries.js';

export default {
  name: 'eam-equipment-info-page',
  props: {
    id: String
  },
  apollo: {
    item: {
      query() {
        return this.query
      },
      variables() {
        return {
          id: this.equipmentId
        }
      },
      update(data) {
        return data.eam ? data.eam.equipment : null
      },
      skip() {
        return !this.equipmentId
      }
    }
  },
  data() {
    return {
      item: {},      
      query: SINGLE_EQUIPMENT_INFO
    }
  },
  computed: {
    workrequestFilter() {
      return [{ path: 'equipment.id', comparison: 'equal', value: this.equipmentId }]
    },
    loading() {
      return this.$store.getters['eam/loading']
    },
    equipmentId() {
      return this.id ? this.id : this.$route.params.id
    }
  },  
  watch: {
    '$apollo.loading'(value) {
      this.$store.commit('eam/setLoading', value)
    }
  }
}
</script>

<style>
</style>
