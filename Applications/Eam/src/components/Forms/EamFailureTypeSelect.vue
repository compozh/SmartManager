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
import { FAILURE_TYPES } from '@/api/eam-queries.js'

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
      query: FAILURE_TYPES,
      internalValue: this.value
    }
  }
}
</script>

<style>
</style>