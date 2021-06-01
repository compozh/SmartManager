<template>
  <v-textarea v-model="text" dense
              :solo="flat" :flat="flat"
              :label="text ? placeholder : ''"
              :placeholder="placeholder ? placeholder + '...' : ''"
              :readonly="!editable"
              @blur="checkText"
              :rules="required ? requiredRule : []"
              :hide-details="!editable"
              auto-grow rows="1"/>
</template>

<script>
export default {
  name: 'EditableTextField',
  model: {
    prop: 'fieldText'
  },
  props: {
    fieldText: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    required: {
      type: Boolean,
      default: false
    },
    editable: {
      type: Boolean,
      default: true
    },
    changed: {
      type: Boolean,
      default: false
    },
    flat: {
      type: Boolean,
      default: false
    },
    changeHandler: Function
  },
  data: () => ({
    initText: ''
  }),
  watch: {
    // Write init text for backup
    fieldText (text) {
      if (text.trim() && !this.changed) {
        this.initText = text
      }
    },
    // Update init text for backup
    changed (changed) {
      if (!changed) {
        this.initText = this.text
      }
    }
  },
  computed: {
    text: {
      get () {
        return this.fieldText
      },
      set (text) {
        if (text !== this.fieldText && text !== this.initText) {
          if ((text.trim() || !this.required) && !this.changed) {
            this.changeHandler()
          }
          this.$emit('input', text)
        }
      }
    },
    requiredRule () {
      return [v => !!v || this.$t('validate.required')]
    }
  },
  methods: {
    checkText () {
      if (!this.text.trim() && this.required) {
        this.$emit('input', this.initText)
      }
    }
  }
}
</script>

<style scoped>

  .v-textarea >>> .v-messages__message {
    font-weight: normal;
  }

  .v-textarea >>> .v-input__control > .v-input__slot:before {
    border-color: rgba(0, 0, 0, .12) !important;
  }

  .v-textarea:hover >>> .v-input__control > .v-input__slot:before {
    border-color: rgba(0, 0, 0, .22) !important;
  }

</style>
