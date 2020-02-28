<template>
  <v-dialog v-model="show" persistent max-width="400" @keydown.esc="show = false">
    <v-card>
      <v-card-title class="headline">{{this.$t('bpmn.labels.EnterVersionName')}}</v-card-title>
      <v-text-field v-model="value" class="version-name-input" :label="this.$t('bpmn.bpmn-modeler.Name')" autofocus :rules="rules" @keydown.enter="apply" @keydown.esc="show = false"></v-text-field>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" text @click="show = false">{{this.$t('bpmn.buttons.Cancel')}}</v-btn>
        <v-btn color="green darken-1" text @click="apply">{{this.$t('bpmn.buttons.OK')}}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { eventBus } from '../../main';
import { events } from '../../constants';
import { Notification } from 'element-ui';

export default {
  name: 'create-version-dialog',
  data() {
    return {
      show: false,
      value: '',
      item: {},
      rules: [
        value => !!value || this.$t('bpmn.errors.RequiredInputField'),
        value => (value && value.length >= 3) || this.$t('bpmn.errors.MinCharacters'),
      ],
    };
  },
  mounted() {
    eventBus.$on(events.modeler.showCreateVersionDialog, this.onShowVersionDialog);
  },
  beforeDestroy() {
    eventBus.$off(events.modeler.showCreateVersionDialog, this.onShowVersionDialog);
  },
  methods: {
    onShowVersionDialog(item) {
      this.item = item;
      this.value = this.$t('bpmn.labels.NewVersion');
      this.show = true;
    },
    async apply() {
      if (!this.value || this.value.length < 3) {
        return;
      }
      this.show = false;
      if (!(await this.$store.dispatch('bpmn/createDiagramVersion', { diagramId: this.item.id || this.item, versionName: this.value }))) {
        Notification.error(this.$t('bpmn.errors.ProcessNotCreated'));
      } else {
        Notification.success(this.$t('bpmn.labels.MilestoneCreated'));
      }
    }
  }

};
</script>
<style>
.version-name-input {
  padding: 20px;
}
</style>
