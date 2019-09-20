<template>
  <eam-base-autocomplete
    :query="query"
    queryName="equipments"
    :required="required"
    label="Оборудование"
    icon="title"
    nameField="fullName"
    :multiple="multiple"
    v-model="internalValue"
    @input="$emit('input', internalValue)"
  ></eam-base-autocomplete>
</template>

<script>
import { EQUIPMENT_SELECT } from '@/api/eam-queries.js'

export default {
  name: 'eam-equipment-autocomplete',
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
      query: EQUIPMENT_SELECT,
      internalValue: this.value
    }
  }
}
</script>

<style>
</style>