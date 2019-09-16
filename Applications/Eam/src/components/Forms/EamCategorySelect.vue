<template>
  <eam-base-select
    :query="query"
    queryName="workRequestCategories"
    :required="required"
    label="Категория"
    icon="category"
    :multiple="multiple"
    v-model="value"
    @input="$emit('input', value)"
  ></eam-base-select>
</template>

<script>
import { CATEGORIES } from '../../api/eam-queries.js'

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
      query: CATEGORIES
    }
  }
}
</script>

<style>
</style>