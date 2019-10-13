<template>
  <eam-base-select
    :query="query"
    queryName="efficiencyLossSources"
    :required="required"
    label="Источник"
    icon="category"
    :multiple="multiple"
    v-model="internalValue"
    @input="$emit('input', internalValue)"
  ></eam-base-select>
</template>

<script>
import efficiencyLossSources from '@/api/dictionaries/efficiencyLossSources.gql'

export default {
  name: 'efficiency-loss-source-select',
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
      query: efficiencyLossSources,
      internalValue: this.value
    }
  }
}
</script>

<style>
</style>