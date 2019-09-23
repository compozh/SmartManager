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
import { CATEGORIES } from '@/api/eam-queries.js'

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
      query: CATEGORIES,
      internalValue: this.value
    }
  }
}
</script>

<style>
</style>