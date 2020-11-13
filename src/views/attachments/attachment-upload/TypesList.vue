<template>
  <dialog-card :value="showTypeList" width="600px"
               @input="$emit('update:showTypeList', $event)"
               :title="$t('attachments.typesTitle')"
               @close="closeTypeList">
    <template #text>
      <v-radio-group column mandatory :value="type">
        <v-radio v-for="(type, idx) in typeList"
                 :key="idx"
                 :label="type.NAME"
                 :value="type.CODE"
                 @change="setType(type)"
                 class="mb-5">
        </v-radio>
      </v-radio-group>
    </template>
    <template #actions>
      <v-spacer/>
      <v-btn outlined x-small
             color="primary"
             class="add-btn pa-0"
             @click="closeTypeList">
        <label :for="objectId" class="add-label pa-2">
          {{ $t('buttons.addAttachment') }}
        </label>
      </v-btn>
    </template>
  </dialog-card>
</template>

<script>
const DialogCard = () => import('@/components/DialogCard')

export default {
  name: 'TypesList',
  model: {
    value: 'typeCode'
  },
  props: {
    showTypeList: Boolean,
    typeList: Array,
    typeCode: String,
    objectId: [String, Number]
  },
  components: {
    DialogCard
  },
  computed: {
    currentType () {
      return this.$store.state.attachments.currentType || {}
    },
    type () {
      return this.currentType.CODE || ''
    }
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

  .add-btn {
    min-height: 25px;
    min-width: 50px;
  }

  .add-btn >>> span {
    height: 25px;
    width: 100%;
  }

  .add-btn .add-label {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    height: 100%;
    width: 100%;
    font-size: 12px;
  }

</style>
