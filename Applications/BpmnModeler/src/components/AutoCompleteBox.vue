<template>
  <v-autocomplete
    v-model="select"
    :items="items"
    :loading="loading"
    :search-input.sync="search"
    :label="label"
    :disabled="disabled"
    :readonly="readonly"
    :rules="rules"
    item-value="id"
    item-text="name"
    no-filter
    :multiple="multiple"
    :chips="multiple"
    deletable-chips
    @change="change"
    ref="autocomplete"
  >
    <template #item="data">
      <slot name="item" :data="data"></slot>
    </template>
  </v-autocomplete>
</template>
<script>
import { debounce } from 'throttle-debounce';

export default {
  name: 'autocompletebox',
  props: {
    label: String,
    queryItems: Function,
    value: {},
    disabled: Boolean,
    readonly: Boolean,
    rules: Array,
    multiple: Boolean
  },
  mounted() {
    this.query = debounce(300, this.getItems);
    this.select = this.value;
  },
  data() {
    return {
      items: [],
      select: null,
      loading: false,
      search: '',
      query: null
    };
  },
  watch: {
    queryItems() {
      this.query = debounce(300, this.getItems);
    },
    search(value) {
      if (this.queryItems) {
        if (!this.query) {
          this.query = debounce(300, this.getItems);
        }
        this.query();
      }
    },
    select(value) {
      this.$emit('input', value);
    }
  },
  methods: {
    async getItems() {
      this.loading = true;
      this.items = await this.queryItems(this.disabled && !this.search && this.value ? this.value : this.search);
      this.loading = false;
    },
    change(ev) {
      this.$refs.autocomplete.blur()
      this.search = ''
    }
  }
};
</script>
<style>

</style>