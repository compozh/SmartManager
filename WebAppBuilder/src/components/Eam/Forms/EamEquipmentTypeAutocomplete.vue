<template>
  <eam-base-autocomplete
    :query="query"
    queryName="equipmentTypes"
    :required="required"
    label="Тип оборудования"
    icon="title"
    :multiple="multiple"
    v-model="value"
    @input="$emit('input', value)"
  ></eam-base-autocomplete>
</template>

<script>
import { EQUIPMENT_TYPES_SELECT } from '../api/eam-queries.js'

export default {
  name: 'eam-equipment-type-autocomplete',
  props: {
    value: [String, Array],
    required: {
      type: Boolean,
      default: false
    },
    multiple: Boolean
  },
  data() {
    return {
      query: EQUIPMENT_TYPES_SELECT
    }
  }
}
</script>

<style>
</style>