<template>
  <v-card>
    <v-card-title>
      <span class="headline">{{ titles[mode] }}</span>
    </v-card-title>
    <v-card-text>
      <v-container grid-list-md>
        <v-layout wrap>
          <v-flex xs12>
            <v-text-field :label="$tc('bpmn.labels.ProcessName')" v-model="model.name" :disabled="loading || mode === 'delete'" required></v-text-field>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn :disabled="loading" flat @click="cancel()">{{ $tc('bpmn.buttons.Cancel') }}</v-btn>
      <v-btn :loading="loading" flat @click="save()" color="primary">{{ actions[mode] }}</v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
export default {
  name: 'bpmn-model-form',
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
        return { id: '', name: '', xml: '' }
      }
    }
  },
  data() {
    return {
      titles: {
        'create': this.$tc('bpmn.labels.CreateProcess'),
        'edit': this.$tc('bpmn.labels.EditProcess'),
        'delete': this.$tc('bpmn.labels.DeleteProcess')
      },
      actions: {
        'create': this.$tc('bpmn.buttons.Save'),
        'edit': this.$tc('bpmn.buttons.Save'),
        'delete': this.$tc('bpmn.buttons.Delete')
      }
    }
  },
  methods: {
    cancel() {
      this.$emit('close');
    },
    save() {
      this.$emit('save', this.model)
    }
  }
}
</script>
<style>

</style>