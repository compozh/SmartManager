<template>
  <v-dialog :value="showTypeList"
            scrollable max-width="300px">
    <v-card>
      <v-card-title>
        {{ $t('attachments.typesTitle') }}
      </v-card-title>
      <v-divider/>
      <v-card-text style="height: 300px;">
        <v-radio-group :value="value"
                       column mandatory>
          <v-radio v-for="type in typeList"
                   :key="type.CODE"
                   :label="type.NAME"
                   :value="type.CODE"
                   @change="$emit('input', type.CODE)"
                   :class="{'order-first': type.CODE === ''}">
          </v-radio>
        </v-radio-group>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn color="blue darken-1" text
               @click="closeTypeList">
          {{ $t('buttons.close') }}</v-btn>
        <v-btn color="blue darken-1 pa-0" text @click="closeTypeList">
          <label for="file" class="add-label pa-2">
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
    value: String
  },
  methods: {
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
