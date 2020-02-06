<template>
  <eam-base-select
    :query="query"
    queryName="efficiencyLossCategories"
    :required="required"
    label="Категория"
    icon="category"
    :constantFilter="constantFilter"
    :multiple="multiple"
    v-model="internalValue"
    @input="$emit('input', internalValue)"
  ></eam-base-select>
</template>

<script>
import efficiencyLossCategories from '@/api/dictionaries/efficiencyLossCategories.gql'

export default {
  name: 'efficiency-loss-category-select',
  props: {
    value: [String, Array],
    required: {
      type: Boolean,
      default: false
    },
    constantFilter: Array,
    multiple: Boolean
  },
  data() {
    return {
      query: efficiencyLossCategories,
      internalValue: this.value
    }
  }
}
</script>

<style>
</style>