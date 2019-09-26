<template>
  <eam-base-select
    :query="query"
    queryName="workRequestCategories"
    :required="required"
    label="Категория"
    icon="category"
    :multiple="multiple"
    v-model="internalValue"
    @input="$emit('input', internalValue)"
  ></eam-base-select>
</template>

<script>
import categories from '@/api/dictionaries/workRequestCategories.gql'

export default {
  name: 'eam-category-select',
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
      query: categories,
      internalValue: this.value
    }
  }
}
</script>

<style>
</style>