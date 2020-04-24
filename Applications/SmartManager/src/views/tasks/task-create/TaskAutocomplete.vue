<template>
  <v-autocomplete :value="value"
                  @input="$emit('input', $event)"
                  :items="items"
                  :label="label"
                  :multiple="multiple"
                  :loading="loading"
                  :disabled="loading"
                  outlined
                  dense
                  chips
                  item-text="fio"
                  item-value="userId">

    <template v-slot:selection="data">
      <v-chip v-bind="data.attrs"
              :input-value="data.selected"
              close
              @click="data.select"
              @click:close="remove(data.item)">
        <v-avatar left>
          <v-img :src="data.item.avatar"></v-img>
        </v-avatar>
        {{ data.item.name }}
      </v-chip>
    </template>

    <template v-slot:item="data">
      <template v-if="typeof data.item !== 'object'">
        <v-list-item-content v-text="data.item"></v-list-item-content>
      </template>
      <template v-else>
        <v-list-item-avatar>
          <img :src="data.item.photo">
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title v-html="data.item.fio"></v-list-item-title>
        </v-list-item-content>
      </template>
    </template>
  </v-autocomplete>
</template>

<script>
export default {
  name: 'TaskAutocomplete',
  props: {
    value: {
      type: [Object, String],
      required: true
    },
    items: {
      type: [Object, Array],
      required: true
    },
    label: String,
    multiple: Boolean,
    loading: Boolean
  }
}
</script>

<style scoped>

</style>
