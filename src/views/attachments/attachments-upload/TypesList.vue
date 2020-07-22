<template>
  <v-dialog :value="showTypeList"
            @input="$emit('update:showTypeList', $event)"
            scrollable max-width="600px">
    <v-card>
      <v-card-title>
        {{ $t('attachments.typesTitle') }}
      </v-card-title>
      <v-divider/>
      <v-card-text style="height: 400px;">
        <v-radio-group column mandatory>
          <v-radio v-for="(type, idx) in typeList"
                   :key="idx"
                   :label="type.NAME"
                   :value="type.CODE"
                   @change="setType(type)"
                   :class="['mb-5', {'order-first': type.CODE === ''}]">
          </v-radio>
        </v-radio-group>
      </v-card-text>
      <v-divider/>
      <v-card-actions class="justify-end">
        <v-btn color="blue darken-1" text
               @click="closeTypeList">
          {{ $t('buttons.close') }}</v-btn>
        <v-btn color="blue darken-1 pa-0" text @click="closeTypeList">
          <label :for="objectId" class="add-label pa-2">
            {{ $t('buttons.addAttachment') }}
          </label>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>

export default {
  name: 'TypesList',
  props: {
    showTypeList: Boolean,
    typeList: Array,
    value: String,
    objectId: [String, Number]
  },
  methods: {
    setType (type) {
      this.$emit('input', type.CODE)
      // Adding type object to store for file extensions allowed to upload
      this.$store.commit('SET_CURRENT_TYPE', type)
    },
    closeTypeList () {
      this.$emit('update:showTypeList', false)
    }
  }
}
</script>

<style scoped>

  .add-label {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    height: 100%;
    width: 100%;
  }
</style>
