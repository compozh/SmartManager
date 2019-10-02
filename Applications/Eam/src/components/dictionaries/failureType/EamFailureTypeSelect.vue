<template>
  <eam-base-select
    :query="query"
    queryName="equipmentFailureTypes"
    :required="required"
    label="Вид"
    icon="category"
    :multiple="multiple"
    v-model="internalValue"
    @input="$emit('input', internalValue)"
  ></eam-base-select>
</template>

<script>
import equipmentFailureTypes from '@/api/dictionaries/equipmentFailureTypes.gql'

export default {
  name: 'eam-failure-type-select',
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
      query: equipmentFailureTypes,
      internalValue: this.value
    }
  }
}
</script>

<style>
</style>