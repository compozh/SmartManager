<template>
  <div class="d-flex align-center font-weight-light">
    <fa-icon :icon="businessObject ? 'cubes' : 'paperclip'" :class="`${mr}-3`" size="lg"/>
    <span :class="`${mr}-3`">{{ listTitle.toUpperCase() }}</span>
    <v-btn v-if="attachmentTypes.length"
           outlined x-small
           color="primary"
           :class="`add-btn pa-0 ${mr}-5`"
           @click="newAttachment()">
      <label :for="attachmentTypes.length <= 1 ? objectId : ''"
             class="add-label pa-2">
        {{ $t('buttons.addAttachment') }}
      </label>
    </v-btn>
    <v-spacer/>

    <template v-if="references(businessObject).length">
      <v-tooltip v-for="(reference, idx) in references(businessObject)"
                 :key="idx" top>
        <template #activator="{ on }">
          <v-btn v-on="on"
                 :href="reference.Hyperlink"
                 target="_blank"
                 outlined x-small
                 color="success"
                 :class="`add-btn ${mr}-5`">
            <span v-if="reference.Icon"
                  v-html="reference.Icon"
                  :class="`linkIcon ${mr}-2 success--text`"/>
            <fa-icon v-else
                     icon="question-circle"
                     size="lg"
                     :class="`${mr}-2`"
                     color="success"/>
            {{ reference.Name }}
          </v-btn>
        </template>
        <span>{{ reference.Description }}</span>
      </v-tooltip>
    </template>

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
                :objectId="objectId"
                v-model="attachmentType"/>
  </div>
</template>

<script>
import { tasks, attachments } from '@/mixins/units'

const TypesList = () => import('../attachment-upload/TypesList')

export default {
  name: 'ListHeader',
  mixins: [tasks, attachments],
  props: {
    value: [Boolean, Number],
    businessObject: Object
  },
  components: {
    TypesList
  },
  data: () => ({
    showTypeList: false
  }),
  computed: {
    listTitle () {
      return this.businessObject
        ? this.businessObject.BusinessObjectDefinitionName
        : this.$t('tabs.attachments')
    }
  },
  methods: {
    newAttachment () {
      this.$emit('update:uploadType', 'attachments')
      this.$store.commit('SET_CURRENT_TYPE', this.attachmentTypes[0])
      this.showTypeList = this.attachmentTypes.length > 1
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

  .linkIcon {
    height: 19px;
    width: 19px;
    margin: 1px 1px 0 0;
  }

</style>
