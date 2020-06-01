<template>
  <v-textarea ref="taskNameField"
              :readonly="!taskEditable"
              v-model="name"
              @blur="checkTaskName"
              :rules="[v => !!v || this.$t('validate.required')]"
              auto-grow rows="1"
              solo flat dense
              class="title font-weight-bold">
  </v-textarea>
</template>

<script>
export default {
  name: 'TaskName',
  model: {
    prop: 'taskName'
  },
  props: {
    taskName: String
  },
  data: () => ({
    initTaskName: ''
  }),
  watch: {
    // Write init task name for backup
    taskName (name) {
      if (name.trim() && !this.taskChanged) {
        this.initTaskName = name
      }
    },
    // Update init task name for backup
    taskChanged (changed) {
      if (!changed) {
        this.initTaskName = this.taskName
      }
    }
  },
  computed: {
    name: {
      get () {
        return this.taskName
      },
      set (name) {
        if (name !== this.taskName && name !== this.initTaskName) {
          if (name.trim() && !this.taskChanged) {
            this.$store.commit('SET_TASK_CHANGED', true)
          }
          this.$emit('input', name)
        }
      }
    },
    taskEditable () {
      return this.$store.state.tasks.taskEditable
    },
    taskChanged () {
      return this.$store.state.tasks.taskChanged
    }
  },
  methods: {
    checkTaskName () {
      if (!this.name.trim()) {
        this.$emit('input', this.initTaskName)
      }
    }
  }
}
</script>

<style scoped>

  .v-textarea >>> .v-messages__message {
    font-weight: normal;
  }

</style>
