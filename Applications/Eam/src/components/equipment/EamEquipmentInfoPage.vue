<template>
  <v-container :class="{'ma-0 pa-1': $vuetify.breakpoint.xs}">
    <v-layout v-if="item && item.id" column>
      <eam-equipment-main-info-card :item="item" />
      <eam-work-request-form
        :item="{workRequestDirectionId: '1', workRequestCategoryId: '2', equipmentId}"
      ></eam-work-request-form>
      <eam-work-requests-table :constantFilter="workrequestFilter" />
      <eam-inspections-table :constantFilter="inspectionsFilter" />
      <eam-norms-table v-if="item.model" :constantFilter="normFilter" />
      <eam-condition-parameters-table />
    </v-layout>
  </v-container>
</template>

<script>
import singleEquipmentInfo from '@/api/equipment/singleEquipmentInfo.gql'

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
        if (data.eam && data.eam.equipments && data.eam.equipments.length) {
          return data.eam.equipments[0]
        } else {
          this.$store.commit('eam/setError', 'Оборудование не найдено')
          return null
        }
      },
      skip() {
        return !this.equipmentId
      },
      error(e) {
        this.$store.commit('eam/setError', e.message)
      }
    }
  },
  data() {
    return {
      item: {},
      query: singleEquipmentInfo
    }
  },
  computed: {
    workrequestFilter() {
      return [
        { path: 'equipment.id', comparison: 'equal', value: this.equipmentId }
      ]
    },
    inspectionsFilter() {
      return [
        {
          path: 'technicalPlaceId',
          comparison: 'in',
          value:
            this.item &&
            this.item.currentMovementRecord &&
            this.item.currentMovementRecord.technicalPlace &&
            this.item.currentMovementRecord.technicalPlace.allChildren &&
            this.item.currentMovementRecord.technicalPlace.allChildren.length
              ? [
                ...new Set(
                  this.item.currentMovementRecord.technicalPlace.allChildren.map(
                    c => c.id.toString()
                  )
                )
              ]
              : []
        }
      ]
    },
    normFilter() {
      return [
        { path: 'resource.id', comparison: 'equal', value: this.item.model.id }
      ]
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
