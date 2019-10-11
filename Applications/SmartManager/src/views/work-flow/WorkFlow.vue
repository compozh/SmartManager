<template>
  <div
    class="app-fixed-height border border-solid d-theme-border-grey-light rounded relative overflow-hidden"
  >
    <VuePerfectScrollbar
      class="scroll-area"
      :settings="settings"
    >
      <div class="vx-row form-container">
        <div class="vx-col w-full h-full">
          <vx-card>
            <!-- TASK APPROVALS -->
            <div class="vx-row">
              <div class="vx-col w-full">
                <!-- add task -->
                <form @submit.prevent>
                  <sm-autocomplete :items="businessProcesses"
                                   :multiple="false"
                                   :loading="bpListLoading"
                                   v-model="businessProcess"
                                   @input="getFormDefinition"
                                   label="name"
                                   :placeholder="$t('workflow.businessProcess')"
                                   name="businessProcess"
                                   v-validate="'required'"
                  />
                  <span v-if="errors.has('businessProcess')"
                        class="required-text"
                  >{{ $t('validate.required') }}
                  </span>
                  <vs-divider></vs-divider>
                  <formio class="formio"
                          ref="form"
                          :form="form"
                          :options="options"
                          :submission="submission"
                  />
                  <vs-divider></vs-divider>
                  <div class="vx-col w-full flex">
                    <table v-if="startedProcess.ProcessInstance">
                      <thead class="text-success px-4">Success process started</thead>
                      <tr v-for="(value, name) in startedProcess.ProcessInstance" :key="name">
                        <td class="px-4">{{ name }}</td>
                        <td class="px-4">{{ value }}</td>
                      </tr>
                      <tr v-for="(variable, index) in startedProcess.variables" :key="index">
                        <td class="px-4">Variable: {{ variable.Name }}</td>
                        <td class="px-4">Value: {{ variable.Value }}</td>
                        <td class="px-4">Type: {{ variable.Type }}</td>
                      </tr>
                    </table>
                    <table v-else>
                      <tr v-for="(value, name) in startedProcess" :key="name">
                        <td class="px-4">{{ name }}</td>
                        <td class="px-4">{{ value }}</td>
                    </tr>
                    </table>
                  </div>

                  <vs-divider></vs-divider>
                  <div class="flex justify-end">
                    <vs-button class="mx-6"
                               color="primary"
                               type="flat"
                               @click="$router.go(-1)"
                    >{{ $t('buttons.cancel') }}
                    </vs-button>
                    <vs-button
                      type="gradient"
                      @click="startBusinessProcess"
                    >{{ $t('buttons.start') }}
                    </vs-button>
                  </div>
                </form>
              </div>
            </div>
          </vx-card>
        </div>
      </div>
    </VuePerfectScrollbar>
  </div>
</template>
<script>

import SmAutocomplete from '../../components/SmAutocomplete'
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import {Form} from 'vue-formio'

export default {
  components: {
    VuePerfectScrollbar,
    SmAutocomplete,
    formio: Form,
  },
  props: {},
  data: () => ({
    bpListLoading: false,
    businessProcesses: [],
    businessProcess: null,
    formDefinition: null,
    startedProcess: {},
    options: {noAlerts: true},
    submission: {},
    settings: {
      maxScrollbarLength: 60,
      wheelSpeed: 0.30,
    }
  }),
  computed: {
    form() {
      //return require('./testForm')
      return this.formDefinition
        ? JSON.parse(this.formDefinition.form)
        : []
    },
    userId() {
      return this.$store.state.auth.currentUser.UserData.LoginData.UserId
    }
  },
  created() {
    this.getBusinessProcesses()
  },
  methods: {
    async getBusinessProcesses() {
      this.bpListLoading = true
      const result = await this.$store.dispatch('sm/getBusinessProcesses')
      this.bpListLoading = false
      this.businessProcesses = result
    },
    async getFormDefinition(bp) {
      const result = await this.$store.dispatch(
        'sm/getFormDefinition', bp.deployId
      )
      this.formDefinition = result || null
    },
    getVariables(data) {
      const variables = []
      for (let field in data) {
        const Name = field
        const Value = data[Name]
        variables.push({Name, Value})
      }
      this.defineTypes(variables)
      return variables
    },
    defineTypes(variables) {
      variables.forEach(variable => {
        let value = variable.Value
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
    async startBusinessProcess() {
      const form = this.$refs.form.formio
      const data = form.data
      const variables = this.getVariables(data)

      const processData = {
        ProcessDefinitionId: this.formDefinition.procDefId,
        BusinessKey: `USER[${this.userId}]`,
        Variables: variables
      }
      const result = await this.$store.dispatch('sm/startBusinessProcess', processData)
      this.startedProcess = JSON.parse(result)
      this.startedProcess.variables = variables
    }
  }
}
</script>

<style scoped lang="scss">

  .form-container {
    margin: 15px 0;
  }

  .formio::v-deep {
    @import "~formiojs/dist/formio.form.min.css";
    @import "../../assets/scss/formio";
    @import "~bootstrap/scss/bootstrap";

    button:hover {
      -webkit-transform: translateY(-2px);
      transform: translateY(-2px);
    }
  }

</style>
