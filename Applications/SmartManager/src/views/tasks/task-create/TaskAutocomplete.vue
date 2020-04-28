<template>
  <v-autocomplete :value="value"
                  @input="$emit('input', $event)"
                  :items="items"
                  :label="label"
                  :multiple="multiple"
                  :loading="loading"
                  :disabled="loading"
                  solo flat dense chips
                  hide-details
                  item-text="fio"
                  return-object
                  class="font-weight-bold">

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
          <v-avatar color="primary" class="mr-2" size="25px">
            <fa-icon v-if="!data.item.photo"
                     icon="user" size="xs" inverse/>
            <v-img v-else :src="data.item.photo"/>
          </v-avatar>
          <div>
            {{ data.item.fio }}
          </div>
        </div>
    </template>
    <template #prepend-inner>
      <fa-icon class="mr-2 primary--text"
               :icon="icon"/>
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
    icon: String,
    multiple: Boolean,
    loading: Boolean
  }
}
</script>

<style scoped>

  .v-input >>> .v-input__slot {
    padding: 0 !important;
  }

  .v-list--dense >>> .v-list-item, .v-list-item--dense {
    min-height: 30px !important;
  }
</style>
