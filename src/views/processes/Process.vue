<template>
  <div class="process-component">
    <div v-if="error"
         style="font-size: 40px;"
         class="d-flex py-10">
      <v-btn @click="onComeBackBtn"
             text outlined small
             color="primary"
             :class="`come-back-button ${mr}-3`">
        <fa-icon icon="arrow-alt-left" size="lg" class="primary--text"/>
      </v-btn>
      <p>{{ error }}</p>
    </div>

    <div v-if="form.name"
         class="formio-container">

      <div class="process-header">
        <v-btn @click="onComeBackBtn"
               text outlined
               color="primary"
               class="come-back-button">
          <fa-icon class="primary--text" icon="arrow-alt-left" size="lg"/>
        </v-btn>
        <v-card-title>
          {{ form.name }}
        </v-card-title>
      </div>
      <v-card class="card-form-component">
        <formio-form-component ref="form"
                               :formCode="formCode"
                               :formDefinition="form"/>
      </v-card>

      <v-btn @click="formSubmit"
             color="primary"
             :disabled="startProcessLoading"
             class="start-process-button">
        {{ $t('processes.startProcess') }}
      </v-btn>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Process',
  data: () => ({
    formCode: '',
    form: {},
    startProcessLoading: false,
    error: null
  }),
  async created () {
    this.processDefinitionId = this.$route.params.processId
    if (this.processDefinitionId) {
      const result = await this.$store.dispatch(
        'getFormDefinition', this.processDefinitionId)
      if (result) {
        const data = JSON.parse(result.data)
        const formCode = this.formCode = data.unformio
        const deviceSizeType = this.$vuetify.breakpoint.name
        this.form = await this.$store.dispatch(
          'formio/getForm', { formCode, deviceSizeType })
      } else {
        this.error = this.$t('processes.errors.undefinedFormOfProcess')
      }
    } else {
      this.error = this.$t('processes.errors.processNotPassed')
    }
  },
  computed: {
    userId () {
      return this.$store.getters.userId
    }
  },
  methods: {
    async formSubmit () {
      this.startProcessLoading = true
      const form = this.$refs.form
      try {
        this.$store.commit('START_PRELOADER', 'formSubmit')
        const result = await form.submit()
        if (result) {
          if (result.success && result.successMessage) {
            this.$store.commit('SET_NOTIFY', {
              text: result.successMessage,
              color: 'success'
            })
          } else if (result.errorMessage) {
            this.$store.commit('SET_NOTIFY', {
              text: result.errorMessage,
              color: 'warning'
            })
            return
          }
        }
        await this.startProcess(result.submission)
      } catch (e) {
        if (e.length) {
          e.forEach(e => {
            this.$store.commit('SET_NOTIFY', {
              text: e.message || 'Form submit error',
              color: 'warning'
            })
          })
        } else {
          console.error(e)
          this.$store.commit('SET_NOTIFY', {
            text: e.message || 'Form submit error',
            color: 'error'
          })
        }
      } finally {
        this.startProcessLoading = false
        this.$store.commit('STOP_PRELOADER', 'formSubmit')
      }
    },
    async startProcess (data) {
      const processData = {
        ProcessDefinitionId: this.$route.params.processId,
        BusinessKey: `USER[${this.userId}]`,
        Variables: this.getVariables(data)
      }
      try {
        const result = await this.$store.dispatch('startProcess', processData)
        if (result.SmartManagerTaskId) {
          await this.$router.push('/tasks/active/' + result.SmartManagerTaskId)
        } else {
          const routeToBack = this.$route.params.routeToBack || '/'
          await this.$router.push(routeToBack)
        }
      } catch (e) {
        console.log(e.message)
      }
    },
    getVariables (data) {
      if (typeof data === 'string') {
        data = JSON.parse(data)
      }
      const variables = []
      for (const field in data) {
        // eslint-disable-next-line no-prototype-builtins
        if (data.hasOwnProperty(field)) {
          const Name = field
          const Value = data[Name]
          variables.push({ Name, Value })
        }
      }
      this.defineTypes(variables)
      return variables
    },
    defineTypes (variables) {
      variables.forEach(variable => {
        const value = variable.Value
        let type = typeof value
        if (type === 'number') {
          type = value.toString().includes('.')
            ? 'Double' : 'Integer'
        } else {
          // Capitalize
          type = type.replace(/\S/, s => s.toUpperCase())
        }
        variable.Type = type
      })
    },
    typeToEnum (type) {
      return 'STRING'
    },
    onComeBackBtn () {
      this.$router.push({ name: 'processes' })
    }
  }
}
</script>

<style scoped>

  .process-component {
    height: 100%;
    overflow: hidden;
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
    margin: 0 15px 15px 15px;
    font-weight: 500;
  }

</style>
