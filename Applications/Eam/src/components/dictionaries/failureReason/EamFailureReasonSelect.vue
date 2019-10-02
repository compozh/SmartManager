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
import equipmentFailureReasons from '@/api/dictionaries/equipmentFailureReasons.gql'

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
      query: equipmentFailureReasons,
      internalValue: this.value
    }
  }
}
</script>

<style>
</style>