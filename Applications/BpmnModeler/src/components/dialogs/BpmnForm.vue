<template>
<v-dialog v-if="show" :persistent="loading" v-model="show" max-width="500" @keydown.enter="save()">
  <v-card>
    <v-card-title>
      <span class="headline">{{ $t(titles[type][mode]) }}</span>
      <v-spacer></v-spacer>
      <v-btn-toggle v-if="type != 'all'" v-model="model.isSystem" :title="model.isSystem ? $t('bpmn.labels.SystemRecord') : $t('bpmn.labels.UserRecord')">
        <v-btn :value="true" :disabled="!canChangeIsSystemProperty || loading" text style="flex-grow: 0">
          <v-icon v-if="model.isSystem">mdi-lock</v-icon>
          <v-icon v-else>mdi-lock-open</v-icon>
        </v-btn>
      </v-btn-toggle>
    </v-card-title>
    <v-card-text>
      <v-form ref="form" v-model="valid" onSubmit="return false;" @keydown.enter="save()">
        <v-text-field ref="nameField" @keydown.enter="save()"
          class="nameField"
          v-model="names"
          :label="$t('bpmn.labels.Name')"
          :disabled="loading || mode === 'delete'"
          clearable
          maxLength="254"
          :rules="[rules.required]"></v-text-field>
        <v-radio-group v-model="model.type" row v-if="mode !== 'edit' && type === 'process'" :disabled="mode !== 'create' || loading" :label="$t('bpmn.labels.Type')">
          <v-radio label="BPMN" value="BPMN"></v-radio>
          <v-radio label="DMN" value="DMN"></v-radio>
          <v-radio label="CMMN" value="CMMN"></v-radio>
        </v-radio-group>   
        <v-select 
          v-model="model.kobj" 
          v-if="canSelectAccessObject" 
          :items="itObjects.userAccessObjects"
          :item-text="'nobj'" 
          :item-value="'kobj'"
          :disabled="loading || accessObjectInherited || (itObjects.userAccessObjects.length <= 1 && !itObjects.useAllObjects)"
          :clearable="itObjects.useAllObjects"
          :rules="[rules.kobj]"
          :label="$t('bpmn.labels.AccessObject')"
          >
        </v-select>
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
      accessObjectInherited: true,
      titles: {
        'process': {
          'import': 'bpmn.buttons.Import',
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
        'project': {
          'create': 'bpmn.labels.CreateProject',
          'edit': 'bpmn.labels.EditProject',
          'delete': 'bpmn.labels.DeleteProject'
        },
        'version': {
          'edit': 'bpmn.labels.EditVersion',
          'delete': 'bpmn.labels.DeleteVersion'
        },
        'all': {
          'import': 'bpmn.buttons.Import',
          'delete': 'bpmn.buttons.Delete',
          'copy': 'bpmn.buttons.Copy',
          'create': 'bpmn.buttons.Create',
        }
      },
      actions: {
        'import': 'bpmn.buttons.Import',
        'create': 'bpmn.buttons.Create',
        'edit': 'bpmn.buttons.Save',
        'delete': 'bpmn.buttons.Delete',
        'copy': 'bpmn.buttons.Copy',
      },
      rules: {
        required: value => !!value || this.$t('bpmn.labels.RequiredField'),
        kobj: value => this.itObjects.useAllObjects ? true : this.rules.required(value)
      }
    };
  },
  props: {
    activeItem: {
      required: true
    },
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
    itObjects() {
      return this.$store.state.bpmn.configuration.itObjects;
    },
    names: {
      get: function () {
        return this.type == 'all' ? this.model.map(el => el.name).join(', ') : this.model.name;
      },
      set: function (val) {
        if (this.type == 'all' ) {
          val = val.split(', ') || val;
          this.model.forEach((el, n) => el.name = val[n]);
        } else {
          this.model.name = val;
        }
      }
    },
    active: {
      get() {
        return this.activeItem;
      },
      set(value) {
        if (value === this.activeItem) {
          return;
        }
        this.$emit('update:activeItem', value);
      }
    },
    canSelectAccessObject() {
      return this.mode === 'create' && this.itObjects.isMobj;
    }
  },
  methods: {
    onShowForm(mode, type, model, callback) {
      this.mode = mode;
      this.type = this.$route.name == 'main' ? 'project' : type;
      this.model = model;
      this.accessObjectInherited = !!this.model.kobj;
      if (!this.accessObjectInherited && this.canSelectAccessObject) {
        this.model.kobj = this.itObjects.userDefaultObject;
      }
      this.callback = callback;
      this.show = true;
      setTimeout(() => this.$refs.nameField.focus(), 1);
    },
    cancel() {
      this.$refs.form.resetValidation();
      this.show = false;
    },
    async save() {
      if (!this.$refs.form.validate() || this.loading) {
        return;
      }
      if (this.callback) {
        this.loading = true;
        if (this.mode == 'import') { this.mode = 'create'; }
        let success = await this.callback(this.model, this.type == 'project' ? 'folder' : this.type , this.mode);

        if (success) {
          await this.$store.dispatch('bpmn/loadItems', true);
          this.cancel();
          if ((this.type == 'process' || this.type == 'project') && (this.mode == 'create' || this.mode == 'copy' ) ) {
            this.active = this.model.id;
          }
          this.callback = null;
        }
        this.loading = false;
      }
    }
  }
};
</script>
<style>
.v-input--radio-group__input > label.v-label {
  width: 100%;
}
</style>
