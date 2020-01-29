<template>
<v-dialog v-if="show" :persistent="loading" v-model="show" max-width="500">
  <v-card>
    <v-card-title>
      <span class="headline">{{ $t(titles[type][mode]) }}</span>
      <v-spacer></v-spacer>
      <v-btn-toggle v-if="type != 'all'" v-model="model.isSystem" :title="model.isSystem ? $t('bpmn.labels.SystemRecord') : $t('bpmn.labels.UserRecord')">
        <v-btn :value="true" :disabled="!canChangeIsSystemProperty || loading" text style="flex-grow: 0">
          <v-icon v-if="model.isSystem">lock</v-icon>
          <v-icon v-else>lock_open</v-icon>
        </v-btn>
      </v-btn-toggle>
    </v-card-title>
    <v-card-text>
      <v-form ref="form" v-model="valid" onSubmit="return false;">
        <v-text-field ref="nameField"
          v-model="names"
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
      <v-btn :disabled="loading" text @click="cancel()">{{ $t('bpmn.buttons.Cancel') }}</v-btn>
      <v-btn :loading="loading" :disabled="!valid" text @click="save()" color="primary">{{ $t(actions[mode]) }}</v-btn>
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
          'create': 'bpmn.labels.CreateProcess',
          'edit': 'bpmn.labels.EditProcess',
          'delete': 'bpmn.labels.DeleteProcess',
          'copy': 'bpmn.labels.CopyProcess',
        },
        'folder': {
          'create': 'bpmn.labels.CreateFolder',
          'edit': 'bpmn.labels.EditFolder',
          'delete': 'bpmn.labels.DeleteFolder',
          'copy': 'bpmn.labels.CopyFolder',
        },
        'all': {
          'delete': 'bpmn.labels.Delete',
          'copy': 'bpmn.buttons.Copy',
        }    
      },
      actions: {
        'create': 'bpmn.buttons.Create',
        'edit': 'bpmn.buttons.Save',
        'delete': 'bpmn.buttons.Delete',
        'copy': 'bpmn.buttons.Copy',
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
    },
    names: {
      get: function () {
        return this.type == 'all' ? this.model.map(el => el.name).join(', ') : this.model.name
      },
      set: function (val) {
        if(this.type == 'all' ) {
          val = val.split(', ')
          this.model.forEach((el, n) => el.name = val[n])
        } else {
          this.model.name = val
        }
      },
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
        let success = await this.callback(this.model, this.type, this.mode);
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