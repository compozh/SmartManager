<template>
  <eam-base-select
    :query="query"
    queryName="efficiencyLossReasons"
    :required="required"
    label="Причина"
    icon="category"
    :multiple="multiple"
    v-model="internalValue"
    @input="$emit('input', internalValue)"
  ></eam-base-select>
</template>

<script>
import efficiencyLossReasons from '@/api/dictionaries/efficiencyLossReasons.gql'

export default {
  name: 'efficiency-loss-reason-select',
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
      query: efficiencyLossReasons,
      internalValue: this.value
    }
  }
}
</script>

<style>
</style>