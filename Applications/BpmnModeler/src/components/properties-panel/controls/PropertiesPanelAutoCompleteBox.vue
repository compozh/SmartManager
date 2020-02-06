<template>
  <v-autocomplete
    auto-select-first
    item-value="id"
    item-text="name"
    :label="label"
    :readonly="readonly"
    :clearable="clearable"
    :rules="rules"
    :loading="loading"
    :items="items"
    v-model="select"
    :filter="filter"
    :prepend-icon="prependIcon"
    :append-outer-icon="appendIcon"
    @click:append-outer="$emit('append')"
    @click:prepend="$emit('prepend')"
  >
    <template #item="data">
      <v-list-item-content :title="data.item.name">
        <v-list-item-title v-html="data.item.name"></v-list-item-title>
        <v-list-item-subtitle class="text-left" v-html="data.item.id"></v-list-item-subtitle>
      </v-list-item-content>
    </template>
  </v-autocomplete>
</template>
<script>
export default {
  name: 'properties-panel-autocompletebox',
  props: {
    label: String,
    readonly: Boolean,
    clearable: Boolean,
    rules: Array,
    loadItems: {
      type: Promise,
      required: true
    },
    value: {},
    prependIcon: String,
    appendIcon: String
  },
  data() {
    return {
      items: [],
      loading: false,
      select: null
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(value) {
        this.select = value;
      }
    },
    select(value) {
      if (this.value != value) {
        this.$emit('input', value);
      }
    },
    loadItems: {
      immediate: true,
      async handler(value) {
        this.loading = true;
        this.items = await value;
        this.loading = false;
      }
    }
  },
  methods: {
    filter(item, queryText) {
      for (const key in item) {
        if (({}).hasOwnProperty.call(item, key)) {
          const property = item[key];
          if (property && property.toString().toLocaleLowerCase().indexOf(queryText.toLocaleLowerCase()) >= 0) {
            return true;
          }
        }
      }
      return false;
    }
  }
}
</script>