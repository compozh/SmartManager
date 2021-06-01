<template>
  <v-autocomplete :value="value"
                  @input="$emit('input', $event)"
                  :rules="required"
                  :items="items"
                  :label="label"
                  :multiple="multiple"
                  :loading="loading"
                  :disabled="loading"
                  tabindex="2"
                  cache-items
                  solo flat dense chips
                  item-text="fio"
                  return-object>

    <template v-slot:selection="data">
      <v-chip v-bind="data.attrs"
              :input-value="data.selected"
              outlined close
              :class="`${ml}-n2`"
              @click="data.select"
              @click:close="$emit('remove', data.item)">
        <span class="text-truncate">{{ data.item.fio }}</span>
      </v-chip>
    </template>

    <template #item="data">
      <div class="d-flex align-center">
        <v-avatar color="primary" :class="`${mr}-3`" size="25px">
          <fa-icon v-if="!data.item.photo"
                   icon="user" size="xs" inverse/>
          <v-img v-else :src="data.item.photo"/>
        </v-avatar>
        <div class="grey--text">
          {{ data.item.fio }}
        </div>
      </div>
    </template>

    <template #prepend-inner>
      <slot name="icon">
          <fa-icon :class="`${mr}-2 primary--text`"
                   :icon="icon"/>
      </slot>
    </template>
  </v-autocomplete>
</template>

<script>
export default {
  name: 'TaskAutocomplete',
  props: {
    value: {
      type: [Object, Array],
      default: () => {}
    },
    items: {
      type: Array,
      default: () => []
    },
    label: String,
    icon: String,
    multiple: Boolean,
    loading: Boolean
  },

  computed: {
    required () {
      return [
        v => !!(v && v.userId) || this.$t('validate.required')
      ]
    }
  }
}
</script>

<style scoped>

  .v-input >>> .v-input__slot,
  .v-input >>> .v-text-field__details {
    padding: 0 !important;
  }

  .v-input >>> label {
    color: #9e9e9e;
    font-size: 18px;
    font-weight: normal;
  }

  .v-list--dense >>> .v-list-item, .v-list-item--dense {
    min-height: 35px !important;
    padding: 0 8px;
    font-size: 16px;
  }
</style>
