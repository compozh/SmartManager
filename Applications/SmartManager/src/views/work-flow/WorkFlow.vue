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
                    <div>
                      <formio id="formio"
                              class="formio-container"
                              :form="form"
                      />
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
import { Form } from 'vue-formio'

export default {
  components: {
    VuePerfectScrollbar,
    SmAutocomplete,
    formio: Form,
  },
  props: {

  },
  data: () => ({
    bpListLoading: false,
    businessProcess: null,
    formDefinition: null,
    options: { noAlerts: true },
    settings: {
      maxScrollbarLength: 60,
      wheelSpeed: 0.30,
    }
  }),
  computed: {
    businessProcesses() {
      return this.$store.state.sm.businessProcesses
    },
    form() {
      return {
        display: 'form',
        components: this.formDefinition
          ? JSON.parse(this.formDefinition)
          : []
      }
    }
  },
  created() {
    this.getBusinessProcesses()
  },
  methods: {
    async getBusinessProcesses() {
      this.bpListLoading = true
      const bp = this.$store.state.sm.businessProcesses
      if (bp.length === 0) {
        await this.$store.dispatch('sm/getBusinessProcesses')
      }
      this.bpListLoading = false
    },
    async getFormDefinition(bp) {
      const result = await this.$store.dispatch(
        'sm/getFormDefinition', bp.deployId
      )
      this.formDefinition = result ? result : null
    },
  }
}
</script>

<style scoped lang="scss">

  .form-container {
    margin: 15px 0;
  }

  .formio-container::v-deep {
    @import "~formiojs/dist/formio.form.min.css";
    @import "../../assets/scss/formio";
    @import "~bootstrap/scss/bootstrap";

    button:hover {
      -webkit-transform: translateY(-2px);
      transform: translateY(-2px);
    }
  }

</style>
