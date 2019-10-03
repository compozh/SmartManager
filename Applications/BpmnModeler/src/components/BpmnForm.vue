<template>
  <v-card>
    <v-card-title>
      <span class="headline">{{ titles[type][mode] }}</span>
      <v-spacer></v-spacer>
      <v-btn-toggle v-model="model.isSystem" :title="model.isSystem ? $t('bpmn.labels.SystemRecord') : $t('bpmn.labels.UserRecord')">
        <v-btn :value="true" :disabled="mode !== 'create' || !this.canModifySystemObjects" flat style="flex-grow: 0">
          <v-icon v-if="model.isSystem">lock</v-icon>
          <v-icon v-else>lock_open</v-icon>
        </v-btn>
      </v-btn-toggle>
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
        <v-radio-group v-model="model.type" row v-if="mode === 'create' && !model.isFolder" :label="$t('bpmn.labels.Type')">
          <v-radio label="BPMN" value="BPMN"></v-radio>
          <v-radio label="DMN" value="DMN"></v-radio>
        </v-radio-group>   
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
import Process from '../api/models/Process';
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
        return ['create', 'edit', 'delete' ].indexOf(value) !== -1
      }
    },
    model: {
      type: Object,
      default() {
        return new Process()
      }
    },
    type: {
      type: String,
      validator(value) {
        return ['process', 'folder' ].indexOf(value) !== -1
      },
      default() {
        return 'process';
      }
    }
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
  computed: {
    canModifySystemObjects() {
      return this.$store.state.bpmn.configuration.canModifySystemObjects;
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
.v-input--radio-group__input > label.v-label {
  width: 100%;
}
</style>