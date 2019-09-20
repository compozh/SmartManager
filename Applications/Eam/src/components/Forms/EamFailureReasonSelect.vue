<template>
  <eam-base-select
    :query="query"
    queryName="equipmentFailureReasons"
    :required="required"
    label="Причина"
    icon="category"
    :multiple="multiple"
    v-model="internalValue"
    @input="$emit('input', internalValue)"
  ></eam-base-select>
</template>

<script>
import { FAILURE_REASONS } from '@/api/eam-queries.js'

export default {
  name: 'eam-failure-reason-select',
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
      query: FAILURE_REASONS,
      internalValue: this.value
    }
  }
}
</script>

<style>
</style>