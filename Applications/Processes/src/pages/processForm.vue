<template>
    <div>
        <spinner v-if="isLoading" class="spinner" />

        <div v-if="error" style="font-size: 40px;" justify="center" class="py-10">
          <p>{{error}}</p>
        </div>

        <v-flex class="formio-container" v-if="form">

            <v-card-title>
              {{form.name}}
            </v-card-title>

            <v-card class="card-form-component">
              <formio-form-component
                  ref="formioFormComponent"

                  :formDefinition="form"
                  :formCode="form.name"
              />
            </v-card>

            <v-btn
                @click="onStartProcessClick"
                text
                outlined
                color="primary"
                :loading="startProcessLoading"
                class="start-process-button"
            >
                {{$t('processes.buttons.startProcess')}}
            </v-btn>
        </v-flex>
    </div>
</template>

<script>
export default {
  name: 'process-form-page',

  data () {
    return {
      form: null,
      isLoading: false,
      startProcessLoading: false,
      error: null
    }
  },
  created () {
    this.processDefinitionId = this.$route.params.id
    if (this.processDefinitionId) {
      this.isLoading = true
      this.$store.dispatch('getForm', this.processDefinitionId).then(result => {
        this.isLoading = false
        if (!result.form) {
          this.error = this.$t('processes.errors.undefinedFormOfProcess')
        } else {
          this.form = result.form
        }
      })
    } else {
      this.error = this.$t('processes.errors.processNotPassed')
    }
  },
  methods: {
    async onStartProcessClick (params) {
      let formComponent = this.$refs.formioFormComponent
      let submitResult = await formComponent.submit()
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
        this.$store.commit('setSnackbarSuccessMessage', this.$t('processes.messages.processSuccess'))
        // window.close()
      })
    },
    typeToEnum (type) {
      return 'STRING'
    }
  }
}
</script>

<style scoped>
  .card-form-component {
    margin: 15px;
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

  .start-process-button {
    margin-bottom: 15px;
  }
</style>
