<template>
  <v-card>
    <v-card-title>
      <span class="headline">{{ titles[type][mode] }}</span>
    </v-card-title>
    <v-card-text>
      <v-container grid-list-md>
        <v-layout wrap>
          <v-flex xs12>
            <v-text-field v-model="model.name"
                          :label="$t('bpmn.labels.Name')"
                          :disabled="loading || mode === 'delete'"
                          clearable
                          autofocus
                          maxLength="254"
                          required></v-text-field>
          </v-flex>
        </v-layout>
      </v-container>
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
      }
    }
  },
  methods: {
    cancel() {
      this.$emit('close');
    },
    save() {
      this.$emit('save', this.model, this.type)
    }
  }
}
</script>
<style>

</style>