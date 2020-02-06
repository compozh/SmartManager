<template>
  <v-select
    :items="items"
    :label="label"
    item-value="id"
    :item-text="nameField"
    :rules="rules"
    :prepend-icon="icon"
    :multiple="multiple"
    :loading="$apollo.loading"
    v-model="internalValue"
    @input="$emit('input', internalValue)"
    @click.native.prevent="change=true"
  ></v-select>
</template>

<script>
export default {
  name: 'eam-base-select',
  props: {
    value: [String, Number, Array],
    constantFilter: Array,
    query: Object,
    queryName: String,
    constantOrderBy: Array,
    nameField: {
      type: String,
      default: 'name'
    },
    required: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: 'Значение'
    },
    icon: String,
    multiple: Boolean
  },
  apollo: {
    itemsQuery: {
      query() {
        return this.query
      },
      variables() {
        return {
          where: this.where,
          orderBy: this.orderBy
        }
      },
      update(data) {        
        return data.eam[this.queryName]
      },
      skip() {
        return !this.change
      }
    }
  },
  data() {
    return {      
      itemsQuery: {},
      orderById: [{ path: 'id' }],
      change: !!this.value,
      internalValue: this.value
    }
  },
  computed: {
    where() {
      return this.constantFilter
    },
    orderBy() {
      return this.constantOrderBy ? this.constantOrderBy : this.orderById
    },
    rules() {
      return this.required ? [v => !!v || 'Обязательно для заполнения'] : []
    },
    items() {
      return this.itemsQuery && Array.isArray(this.itemsQuery)
        ? this.itemsQuery
        : []
    }
  },
  watch: {
    '$apollo.loading'(value) {
      this.$store.commit('eam/setLoading', value)
    }
  }
}
</script>

<style>
</style>