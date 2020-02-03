<template>
    <div>
        <spinner v-if="isLoading" class="spinner" />

        <div class="formio-container" v-if="form">
            <formio-form-component
                ref="formioFormComponent"

                :formDefinition="form"
                :formCode="form.name"
            />

            <v-btn
                @click="onStartProcessClick"
                text
                outlined
                color="primary"
                :loading="startProcessLoading"
            >
                {{$t('processes.buttons.startProcess')}}
            </v-btn>
        </div>
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
    this.processDefinitionId = this.$route.params.id
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
    async onStartProcessClick (params) {
      let formComponent = this.$refs.formioFormComponent
      let submitResult = await formComponent.submit()
      debugger
      let submitData = submitResult.data
      let processVariables = []

      for (var variable of Object.keys(submitData)) {
        let value = submitData[variable]
        let processVariable = {
          name: variable,
          value,
          type: this.typeToEnum(typeof (value))
        }
        processVariables.push(processVariable)
      }

      this.startProcessLoading = true
      this.$store.dispatch('startProcess', { processDefinitionId: this.processDefinitionId, processVariables }).then(result => {
        this.startProcessLoading = false
        window.close()
      })
    },
    typeToEnum (type) {
      debugger
      switch (type) {
        case 'bollean':
          break
        default:
          return 'STRING'
      }
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
