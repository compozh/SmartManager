<template>
  <eam-base-autocomplete
    :query="query"
    queryName="equipmentTypes"
    :required="required"
    label="Тип оборудования"
    icon="title"
    :multiple="multiple"
    v-model="internalValue"
    @input="$emit('input', internalValue)"
  ></eam-base-autocomplete>
</template>

<script>
import equipmentTypes from '@/api/equipmentTypes/equipmentTypes.gql'

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
      query: equipmentTypes,
      internalValue: this.value
    }
  }
}
</script>

<style>
</style>