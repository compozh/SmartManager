<template>
<v-dialog v-if="show" :persistent="loading" v-model="show" max-width="500">
  <v-card>
    <v-card-title>
      <span class="headline">{{ titles[type][mode] }}</span>
      <v-spacer></v-spacer>
      <v-btn-toggle v-model="model.isSystem" :title="model.isSystem ? $t('bpmn.labels.SystemRecord') : $t('bpmn.labels.UserRecord')">
        <v-btn :value="true" :disabled="!canChangeIsSystemProperty || loading" flat style="flex-grow: 0">
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
        <v-radio-group v-model="model.type" row v-if="mode !== 'edit' && type === 'process'" :disabled="mode !== 'create' || loading" :label="$t('bpmn.labels.Type')">
          <v-radio label="BPMN" value="BPMN"></v-radio>
          <v-radio label="DMN" value="DMN"></v-radio>
        </v-radio-group>   
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn :disabled="loading" flat @click="cancel()">{{ $t('bpmn.buttons.Cancel') }}</v-btn>
      <v-btn :loading="loading" :disabled="!valid" flat @click="save()" color="primary">{{ actions[mode] }}</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
</template>
<script>
import { eventBus } from '../../main';
import { events } from '../../constants';

export default {
  name: 'bpmn-form',
  data() {
    return {
      show: false,
      loading: false,
      mode: '',
      type: '',
      model: null,
      callback: null,
      valid: true,
      titles: {
        'process': {
          'create': this.$t('bpmn.labels.CreateProcess'),
          'edit': this.$t('bpmn.labels.EditProcess'),
          'delete': this.$t('bpmn.labels.DeleteProcess'),
          'copy': this.$t('bpmn.labels.CopyProcess'),
        },
        'folder': {
          'create': this.$t('bpmn.labels.CreateFolder'),
          'edit': this.$t('bpmn.labels.EditFolder'),
          'delete': this.$t('bpmn.labels.DeleteFolder'),
          'copy': this.$t('bpmn.labels.CopyFolder'),
        }        
      },
      actions: {
        'create': this.$t('bpmn.buttons.Create'),
        'edit': this.$t('bpmn.buttons.Save'),
        'delete': this.$t('bpmn.buttons.Delete'),
        'copy': this.$t('bpmn.buttons.Copy'),
      },
      rules: {
        required: value => !!value || this.$t('bpmn.labels.RequiredField')
      }
    }
  },
  mounted() {
    eventBus.$on(events.modeler.showForm, this.onShowForm);
  },
  beforeDestroy() {
    eventBus.$off(events.modeler.showForm, this.onShowForm);
  },
  computed: {
    canChangeIsSystemProperty() {
      return ['create', 'copy'].includes(this.mode) && this.$store.state.bpmn.configuration.canModifySystemObjects;
    }
  },
  methods: {
    onShowForm(mode, type, model, callback) {
      this.mode = mode;
      this.type = type;
      this.model = model;
      this.callback = callback;
      this.show = true;
    },
    cancel() {
      this.$refs.form.resetValidation();
      this.show = false;
    },
    async save() {
      if (!this.$refs.form.validate()) {
        return;
      }
      if (this.callback) {
        this.loading = true;
        const success = await this.callback(this.model, this.type, this.mode);
        this.loading = false;
        if (success) {
          this.cancel();
        }
        this.callback = null;
      }
    }
  }
}
</script>
<style>
.v-input--radio-group__input > label.v-label {
  width: 100%;
}
</style>