<template>
    <div class="rounded relative overflow-hidden">
      <VuePerfectScrollbar :settings="settings" class="scroll-area">
            <vx-card>
              <div class="d-flex">
                <div class="w-full">
                  <!-- select and start business-process -->
                  <form @submit.prevent>
                    <autocomplete :items="businessProcesses"
                                  :multiple="false"
                                  :loading="bpListLoading"
                                  v-model="businessProcess"
                                  @input="getFormDefinition"
                                  label="name"
                                  :title="$t('workflow.businessProcess')"
                                  :placeholder="$t('workflow.bpSelectLabel') + '...'"
                                  name="businessProcess"
                                  v-validate="'required'"
                                  icon="ExternalLinkIcon"
                    />
                    <span v-if="errors.has('businessProcess')"
                          class="required-text"
                    >{{ $t('validate.required') }}
                    </span>

                    <formio-form-component class="formio mt-4"
                                           ref="form"
                                           :formCode="formCode"
                                           :formDefinition="formDefinition"/>

                    <no-data v-if="!this.formDefinition">{{ $t('workflow.bpSelectLabel') }}</no-data>

                    <div class="flex justify-end">
                      <vs-button class="mx-6"
                                 color="primary"
                                 type="flat"
                                 @click="$router.go(-1)"
                      >{{ $t('buttons.cancel') }}
                      </vs-button>
                      <vs-button type="gradient"
                                 @click="onSubmit"
                                 :disabled="!this.formDefinition"
                      >{{ $t('buttons.start') }}</vs-button>
                    </div>
                  </form>
                </div>
              </div>
            </vx-card>
      </VuePerfectScrollbar>
    </div>
</template>

<script>

import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import Autocomplete from '@/components/Autocomplete'
import NoData from '@/components/NoData'

export default {
  components: {
    VuePerfectScrollbar,
    Autocomplete,
    NoData
  },
  data: () => ({
    bpListLoading: false,
    businessProcesses: [],
    businessProcess: null,
    formCode: '',
    formDefinition: {},
    options: {noAlerts: true},
    submission: {},
    settings: {
      maxScrollbarLength: 60,
      wheelSpeed: 0.50,
    },
  }),
  computed: {
    userId() {
      return this.$store.getters['auth/userId']
    }
  },
  beforeRouteEnter(to, from, next) {
    to.params.routeToBack = from.path
    next()
  },
  created() {
    this.getBusinessProcesses()
  },
  methods: {
    async getBusinessProcesses() {
      this.bpListLoading = true
      const result = await this.$store.dispatch('sm/getBusinessProcesses')
      this.bpListLoading = false
      this.businessProcesses = result || []
    },
    async getFormDefinition(bp) {
      const result = await this.$store.dispatch(
        'sm/getFormDefinition', bp.procDefId
      )
      if (result && result.formKey) {
        this.formCode = result.formKey
        this.formDefinition = await this.$store.dispatch(
          'formio/getForm', {
            formCode: result.formKey,
            deviceSizeType: this.$store.state.breakpoint
          }
        )
      }
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
    async onSubmit() {
      const form = this.$refs.form
      try {
        const result = await form.submit()
        if (result) {
          if (result.success) {
            this.$vs.notify({
              title: 'Task form',
              text: result.successMessage || 'Form submit successful',
              color: 'success'
            })
          } else {
            this.$vs.notify({
              title: 'Task form',
              text: result.errorMessage || 'Form submit fail',
              color: 'error'
            })
          }
        }
        await this.startBusinessProcess(result.data)
      } catch (errors) {
        if (errors.length) {
          errors.forEach(e => {
            this.$vs.notify({
              title: this.$t('notify.bpTitle'),
              text: e.message,
              color: 'danger'
            })
          })
        } else {
          console.log(errors.message)
        }
      }
    },
    async startBusinessProcess(data) {
      const processData = {
        ProcessDefinitionId: this.businessProcess.procDefId,
        BusinessKey: `USER[${this.userId}]`,
        Variables: this.getVariables(data)
      }
      try {
        await this.$store.dispatch('sm/startBusinessProcess', processData)
        const routeToBack = this.$route.params.routeToBack
        await this.$router.push(routeToBack)
      } catch (e) {
        console.log(e.message)
      }
    }
  }
}
</script>

<style scoped lang="scss">

  .vx-card {
    box-shadow: 0 4px 20px 0 rgba(0,0,0,.05);
  }

  button:hover {
    -webkit-transform: translateY(-2px);
    transform: translateY(-2px);
  }

</style>
