<template>
  <eam-base-select
    :query="query"
    queryName="workRequestDirections"
    :required="required"
    label="Направление"
    icon="directions"
    :multiple="multiple"
    v-model="internalValue"
    @input="$emit('input', internalValue)"
  ></eam-base-select>
</template>

<script>
import { DIRECTIONS } from '@/api/eam-queries.js'

export default {
  name: 'eam-direction-select',
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
      query: DIRECTIONS,
      internalValue: this.value
    }
  }
}
</script>

<style>
</style>