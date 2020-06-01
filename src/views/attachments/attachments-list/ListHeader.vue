<template>
  <div class="d-flex align-center font-weight-light">
    <fa-icon icon="paperclip" class="mr-3" size="lg"/>
    <span class="mr-3">{{ $t('tabs.attachments').toUpperCase() }}</span>
    <v-btn v-if="!externalTaskCamunda"
           outlined x-small
           color="primary"
           class="add-btn pa-0"
           @click="attachmentTypes.length > 1 ? showTypeList = true : ''">
      <label :for="attachmentTypes.length <= 1 ? 'file' : ''"
             class="add-label pa-2">
        {{ $t('buttons.addAttachment') }}
      </label>
    </v-btn>
    <v-spacer/>

    <v-btn-toggle v-show="attachments.length"
                  :value="value"
                  @change="$emit('input', $event)"
                  mandatory>
      <v-btn text x-small depressed min-height="25">
        <fa-icon icon="bars" size="lg"/>
      </v-btn>
      <v-btn text x-small depressed min-height="25">
        <fa-icon icon="border-all" size="lg"/>
      </v-btn>
    </v-btn-toggle>
    <types-list :showTypeList.sync="showTypeList"
                :typeList="attachmentTypes"
                v-model="attachmentType"/>
  </div>
</template>

<script>
import TypesList from '../attachments-upload/TypesList'
import { tasks, attachments } from '@/mixins/units'

export default {
  name: 'ListHeader',
  mixins: [tasks, attachments],
  props: {
    value: [Boolean, Number]
  },
  components: {
    TypesList
  },
  data: () => ({
    showTypeList: false
  })
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
