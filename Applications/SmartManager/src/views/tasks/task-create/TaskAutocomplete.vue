<template>
  <v-autocomplete :value="value"
                  @input="$emit('input', $event)"
                  :items="items"
                  :label="label"
                  :multiple="multiple"
                  :loading="loading"
                  :disabled="loading"
                  solo flat dense chips
                  item-text="fio"
                  return-object>

    <template v-slot:selection="data">
      <v-chip v-bind="data.attrs"
              :input-value="data.selected"
              outlined close
              @click="data.select"
              @click:close="remove(data.item)">
        <v-avatar left color="primary">
          <fa-icon v-if="!data.item.photo" icon="user"
                   size="xs" inverse/>
          <v-img v-else :src="data.item.photo"/>
        </v-avatar>
        {{ data.item.fio }}
      </v-chip>
    </template>
    <template v-slot:item="data">
        <div class="d-flex align-center">
          <v-avatar color="primary" class="mr-2" size="20px">
            <fa-icon v-if="!data.item.photo"
                     icon="user" size="xs" inverse/>
            <v-img v-else :src="data.item.photo"/>
          </v-avatar>
          <div class="caption">
            {{ data.item.fio }}
          </div>
        </div>
    </template>
  </v-autocomplete>
</template>

<script>
export default {
  name: 'TaskAutocomplete',
  props: {
    value: {
      type: [Object, Array],
      required: true
    },
    items: {
      type: Array,
      default: () => []
    },
    label: String,
    multiple: Boolean,
    loading: Boolean
  }
}
</script>

<style scoped>
  .v-list--dense >>> .v-list-item, .v-list-item--dense {
    min-height: 25px !important;
  }
</style>
