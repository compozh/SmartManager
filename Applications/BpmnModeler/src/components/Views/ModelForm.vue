<template>
  <v-card>
    <v-card-title>
      <span class="headline">{{ titles[mode] }}</span>
    </v-card-title>
    <v-card-text>
      <v-container grid-list-md>
        <v-layout wrap>
          <v-flex xs12>
            <v-text-field :label="$tc('DiagramName')" v-model="model.name" :disabled="loading || mode === 'delete'" required></v-text-field>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn :disabled="loading" flat @click="cancel()">{{ $tc('Cancel') }}</v-btn>
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
        'create': this.$tc('CreateModel'),
        'edit': this.$tc('EditModel'),
        'delete': this.$tc('DeleteModel')
      },
      actions: {
        'create': this.$tc('Save'),
        'edit': this.$tc('Save'),
        'delete': this.$tc('Delete')
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