<template>
  <eam-base-select
    :query="query"
    queryName="efficiencyLossReasons"
    :required="required"
    label="Причина"
    icon="category"
    :constantFilter="constantFilter"
    :multiple="multiple"
    v-model="internalValue"
    @input="$emit('input', internalValue)"
    schema="oee"
  ></eam-base-select>
</template>

<script>
import efficiencyLossReasons from '@/api/dictionaries/efficiencyLossReasons.gql'

export default {
  name: 'efficiency-loss-reason-select',
  props: {
    value: [Number, Array],
    required: {
      type: Boolean,
      default: false
    },
    constantFilter: Array,
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