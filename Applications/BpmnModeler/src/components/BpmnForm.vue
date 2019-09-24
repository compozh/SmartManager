<template>
  <v-card>
    <v-card-title>
      <span class="headline">{{ titles[type][mode] }}</span>
    </v-card-title>
    <v-card-text>
      <v-form ref="form" v-model="valid">
        <v-text-field ref="nameField"
                      v-model="model.name"
                      :label="$t('bpmn.labels.Name')"
                      :disabled="loading || mode === 'delete'"
                      clearable
                      maxLength="254"
                      :rules="[rules.required]"></v-text-field>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn :disabled="loading" flat @click="cancel()">{{ $t('bpmn.buttons.Cancel') }}</v-btn>
      <v-btn :loading="loading" flat @click="save()" color="primary">{{ actions[mode] }}</v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
export default {
  name: 'bpmn-form',
  props: {
    loading: {
      type: Boolean,
      default() {
        return false;
      }
    },
    mode: {
      type: String,
      validator(value) {
        return ['create', 'edit', 'delete'].indexOf(value) !== -1
      }
    },
    model: {
      type: Object,
      default() {
        return { id: '', name: '', parentId: '' }
      }
    },
    type: String
  },
  data() {
    return {
      valid: true,
      titles: {
        'process': {
          'create': this.$t('bpmn.labels.CreateProcess'),
          'edit': this.$t('bpmn.labels.EditProcess'),
          'delete': this.$t('bpmn.labels.DeleteProcess')
        },
        'folder': {
          'create': this.$t('bpmn.labels.CreateFolder'),
          'edit': this.$t('bpmn.labels.EditFolder'),
          'delete': this.$t('bpmn.labels.DeleteFolder')
        }        
      },
      actions: {
        'create': this.$t('bpmn.buttons.Create'),
        'edit': this.$t('bpmn.buttons.Save'),
        'delete': this.$t('bpmn.buttons.Delete')
      },
      rules: {
        required: value => !!value || this.$t('bpmn.labels.RequiredField')
      }
    }
  },
  methods: {
    cancel() {
      this.$refs.form.resetValidation();
      this.$emit('close');
    },
    save() {
      if (this.$refs.form.validate()) {
        this.$refs.form.resetValidation();
        this.$emit('save', this.model, this.type);
      }
    },
    reset() {
      this.$refs.nameField.focus();
      this.$refs.form.resetValidation();
    }
  },
  watch: {
    model() {
      this.reset();
    }
  }
}
</script>
<style>

</style>