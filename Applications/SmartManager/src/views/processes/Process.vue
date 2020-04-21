<template>
    <div class="process-component">
        <div v-if="error" style="font-size: 40px;" justify="center" class="py-10 process-error">
          <v-btn
            @click="onComeBackBtn"
            text
            outlined
            color="primary"
            class="come-back-button"
          >
            <fa-icon class="primary--text" icon="arrow-alt-left" size="lg"/>
          </v-btn>
          <p>{{error}}</p>
        </div>

        <v-flex class="formio-container" v-if="form">

            <div class="process-header">
              <v-btn
                @click="onComeBackBtn"
                text
                outlined
                color="primary"
                class="come-back-button"
              >
                <fa-icon class="primary--text" icon="arrow-alt-left" size="lg"/>
              </v-btn>
              <v-card-title>
                {{form.name}}
              </v-card-title>
            </div>
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
                {{$t('processes.startProcess')}}
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
    this.processDefinitionId = this.$route.query.processId
    if (this.processDefinitionId) {
      this.isLoading = true
      this.$store.dispatch('getForm', this.processDefinitionId).then(result => {
        this.isLoading = false

        if (result.form) {
          this.form = result.form
        } else {
          this.error = this.$t('processes.errors.undefinedFormOfProcess')
        }
      })
    } else {
      this.error = this.$t('processes.errors.processNotPassed')
    }
  },
  methods: {
    async onStartProcessClick (params) {
      const formComponent = this.$refs.formioFormComponent
      const submitResult = await formComponent.submit()
      const submitData = submitResult.submission
      const processVariables = []
      for (var variable of Object.keys(submitData)) {
        const value = submitData[variable]
        const processVariable = {
          name: variable,
          value,
          type: this.typeToEnum(typeof (value))
        }
        processVariables.push(processVariable)
      }
      this.startProcessLoading = true
      this.$store.dispatch('startProcess', { processDefinitionId: this.processDefinitionId, processVariables }).then(result => {
        this.startProcessLoading = false
        if (result.success) {
          this.$router.push({ path: 'processes' })
        } else {
          this.$store.commit('SET_NOTIFY', {
            text: result.errorMessage || 'Form submit error',
            color: 'error'
          })
        }
      })
    },
    typeToEnum (type) {
      return 'STRING'
    },
    onComeBackBtn () {
      this.$router.push({ path: 'processes' })
    }
  }
}
</script>

<style scoped>
  .process-error {
    display: flex;
  }
  .process-component {
    height: 100%;
    overflow: hidden;
    text-align: center;
  }
  .card-form-component {
    margin: 15px;
  }
  .process-header {
    display: flex;
    align-items: center;
    padding: 0 13px;
  }
  .come-back-button {
    height: 58px !important;
    min-width: 40px !important;
  }
  .start-process-button {
    margin-bottom: 15px;
  }
</style>
