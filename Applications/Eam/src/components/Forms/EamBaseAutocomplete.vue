<template>
  <v-autocomplete
    :search-input.sync="search"
    :items="items"
    :label="label"
    item-value="id"
    :item-text="nameField"
    :rules="rules"
    :prepend-icon="icon"
    :multiple="multiple"
    :chips="multiple"
    :loading="$apollo.loading"
    cache-items
    v-model="internalValue"
    @input="$emit('input', internalValue)"
    @click.native.prevent="change=true"
  ></v-autocomplete>
</template>

<script>
export default {
  name: 'eam-base-autocomplete',
  props: {
    value: [String, Array],
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
          take: this.change ? 30 : 100,
          where: this.where,
          orderBy: this.orderBy,
          ids: !this.change
            ? Array.isArray(this.value)
              ? this.value
              : [this.value]
            : null
        }
      },
      update(data) {
        return data.eam[this.queryName]
      },
      skip() {
        return !this.change && !this.value
      }
    }
  },
  data() {
    return {
      itemsQuery: {},
      orderById: [{ path: 'id' }],
      change: false,
      search: null,
      internalValue: this.value
    }
  },
  computed: {
    where() {
      const filters = this.constantFilter ? this.constantFilter : []
      // filters.push({
      //   path: this.nameField,
      //   comparison: 'notEqual'
      // })
      // filters.push({
      //   path: this.nameField,
      //   comparison: 'notEqual',
      //   value: ''
      // })
      if (this.search) {
        filters.push({
          path: this.nameField ? this.nameField : 'name',
          comparison: 'like',
          value: `%${this.search}%`
        })
      }
      return filters
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