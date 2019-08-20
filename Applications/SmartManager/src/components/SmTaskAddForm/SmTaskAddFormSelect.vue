<template>
  <v-autocomplete
    :value="value"
    @input="$emit('input', $event)"
    :items="users"
    color="blue darken-2"
    :label="label"
    item-text="fio"
    item-value="userId"
    :multiple="multiple"
    :rules="rules"
    :disabled="uploading"
  >
    <template v-slot:selection="data">
      <v-chip
        :selected="data.selected"
        close
        color="grey lighten-3"
        class="chip--select-multi"
        @input="remove(data.item)"
      >
        <v-avatar>
          <user-icon :src="data.item.photo" size="30"></user-icon>
        </v-avatar>
        {{ data.item.fio }}
      </v-chip>
    </template>
    <template v-slot:item="data">
      <template v-if="typeof data.item !== 'object'">
        <v-list-tile-content v-text="data.item"></v-list-tile-content>
      </template>
      <template v-else>
        <v-list-tile-avatar>
          <user-icon :src="data.item.photo" size="35"></user-icon>
        </v-list-tile-avatar>
        <v-list-tile-content>
          <v-list-tile-title v-html="data.item.fio"></v-list-tile-title>
        </v-list-tile-content>
      </template>
    </template>
  </v-autocomplete>
</template>

<script>
export default {
  name: 'sm-task-add-form-select',
  props: ['label', 'value', 'multiple', 'rules', 'uploading'],
  computed: {
    users() {
      return this.$store.state.sm.users
    }
  },
  methods: {
    remove(item) {
      if (typeof this.value === 'string') {
        return this.$emit('input', '')
      }
      const index = this.value.indexOf(item.userId)
      if (index >= 0) { this.value.splice(index, 1) }
    }
  }
}
</script>

<style scoped>
  .v-avatar div {
    display: flex;
  }
</style>
