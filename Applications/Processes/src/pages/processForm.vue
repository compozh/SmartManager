<template>
    <div>
        <spinner v-if="isLoading" class="spinner" />

        <div class="formio-container">
            <formio-form-component
            ref="formioFormComponent"

            :formDefinition="form"
            :formCode="form.name"
            />
        </div>

        <v-btn
          @click="onActionBtnClick"
          text
          outlined
          :loading="startProcessLoading"
        >
            {{$t('processes.buttons.startProcess')}}
        </v-btn>
    </div>
</template>

<script>
export default {
  name: 'process-form-page',

  data () {
    return {
      form: null,
      isLoading: false,
      startProcessLoading: false
    }
  },
  created () {
    if (!this.$route.query) {
      this.$store.commit('setError', this.$t('processes.errors.processNotPassed'))
      return
    }

    this.processDefinitionId = this.$route.query.process
    if (this.processDefinitionId) {
      this.isLoading = true
      this.$store.dispatch('getForm', this.processDefinitionId).then(result => {
        this.isLoading = false
        this.form = result.form
      })
    } else {
      this.$store.commit('setError', this.$t('processes.errors.processNotPassed'))
    }
  },
  methods: {
    async onActionBtnClick (params) {
      let formComponent = this.$refs.formioFormComponent
      let submitResult = await formComponent.submit()
      debugger
      let submitData = submitResult.data
      let processVariables = []

      for (var variable of Object.keys(submitData)) {
        let processVariable = {
          name: variable,
          value: submitData[variable],
          type: 'STRING'
        }
        processVariables.push(processVariable)
      }

      this.startProcessLoading = true
      this.$store.dispatch('startProcess', { processDefinitionId: this.processDefinitionId, processVariables }).then(result => {
        this.startProcessLoading = false
        window.close()
      })
    }
  }
}
</script>

<style scoped>
  .actionBtn {
    height: 40px;
    min-width: 170px;
    background: #fff;
    border: 2px solid rgb(25, 118, 210);
    color: rgb(25, 118, 210);
    font-weight: 600;
    text-transform: uppercase;
    border-radius: 4px;
  }
  .spinner {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
  }
</style>
