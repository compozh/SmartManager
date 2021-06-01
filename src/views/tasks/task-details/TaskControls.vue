<template>
  <div class="d-flex">

    <!-- ESCALATION BTN/MENU -->
    <v-tooltip top v-if="escalations">

      <template #activator="{ on: tooltip }">
        <v-menu offset-y nudge-bottom="5">

          <template #activator="{ on: menu }">
            <v-btn v-on="{
                    ...needShowTooltip(tooltip),
                    ...needShowEscalationMenu(menu)
                   }"
                   color="primary"
                   class="mr-2"
                   small depressed
                   @click="needEscalationMenu || getEscalation()">
              <fa-icon icon="flag" size="lg"/>
              <span :class="`${ml}-2 hidden-md-and-down`">
                {{ $t('buttons.escalation') }}
              </span>
            </v-btn>
          </template>

          <v-list dense nav>
            <v-list-item v-for="(escalation, idx) in escalations" :key="idx"
                         @click="getEscalation(escalation)">
              <v-list-item-icon class="align-self-center ma-0">
                <fa-icon icon="flag" fixedSize="15" class="align-self-center"/>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="escalation.Caption"/>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>

      <span class="hidden-lg-and-up">{{ $t('buttons.escalation') }}</span>
    </v-tooltip>

    <!-- EXECUTE BUTTON -->
    <v-tooltip top v-if="internalTaskInWork && taskType === ''">
      <template #activator="{ on }">
        <v-btn v-on="needShowTooltip(on)"
               color="success"
               small depressed
               :disabled="buttonIsBlocked"
               @click="$emit('change-status', '+')">
          <fa-icon icon="check" size="lg"/>
          <span :class="`${ml}-2 hidden-md-and-down`">{{ $t('buttons.execute') }}</span>
        </v-btn>
      </template>
      <span class="hidden-lg-and-up">{{ $t('buttons.execute') }}</span>
    </v-tooltip>

    <!-- EXECUTE BUTTON FOR EXTERNAL-->
    <v-tooltip top v-if="externalTaskCamunda && taskInProgress">
      <template #activator="{ on }">
        <v-btn v-on="needShowTooltip(on)"
               color="success"
               small depressed
               :disabled="buttonIsBlocked"
               @click="$emit('execute-external-task')">
          <fa-icon icon="check" size="lg"/>
          <span :class="`${ml}-2 hidden-md-and-down`">{{ buttonExecute }}</span>
        </v-btn>
      </template>
      <span class="hidden-lg-and-up">{{ buttonExecute }}</span>
    </v-tooltip>

    <!-- RETURN BUTTON -->
    <v-tooltip top v-if="taskIsDone">
      <template #activator="{ on }">
        <v-btn v-on="needShowTooltip(on)"
               color="warning"
               small depressed
               @click="$emit('change-status', '')">
          <fa-icon icon="undo" size="lg"/>
          <span :class="`${ml}-2 hidden-md-and-down`">{{ $t('buttons.returnToWork') }}</span>
        </v-btn>
      </template>
      <span class="hidden-lg-and-up">{{ $t('buttons.returnToWork') }}</span>
    </v-tooltip>

    <!-- APPROVE/REJECT BUTTONS -->
    <div v-if="agreeTaskInWork || taskAtApproval">
      <v-tooltip top>
        <template #activator="{ on }">
          <v-btn v-on="needShowTooltip(on)"
                 color="error"
                 small depressed
                 @click="$emit('change-stage', 0)">
            <fa-icon icon="thumbs-down" size="lg"/>
            <span :class="`${ml}-2 hidden-lg-and-down`">{{ buttonReject }}</span>
          </v-btn>
        </template>
        <span class="hidden-xl-only">{{ buttonReject }}</span>
      </v-tooltip>

      <v-tooltip top>
        <template #activator="{ on }">
          <v-btn v-on="needShowTooltip(on)"
                 color="success"
                 small depressed
                 :class="`${ml}-2`"
                 @click="$emit('change-stage', 1)">
            <fa-icon icon="thumbs-up" size="lg"/>
            <span :class="`${ml}-2 hidden-lg-and-down`">{{ buttonApprove }}</span>
          </v-btn>
        </template>
        <span class="hidden-xl-only">{{ buttonApprove }}</span>
      </v-tooltip>
    </div>

    <!-- FORWARD/BACK BUTTONS -->
    <div v-if="workFlowTaskInWork">
      <v-tooltip top>
        <template #activator="{ on }">
          <v-btn v-on="needShowTooltip(on)"
                 color="error"
                 small depressed
                 @click="$emit('change-stage', 0)">
            <fa-icon icon="arrow-alt-left" size="lg"/>
            <span :class="`${ml}-2 hidden-lg-and-down`">{{ buttonBack }}</span>
          </v-btn>
        </template>
        <span class="hidden-xl-only">{{ buttonBack }}</span>
      </v-tooltip>

      <v-tooltip top>
        <template #activator="{ on }">
          <v-btn v-on="needShowTooltip(on)"
                 color="success"
                 small depressed
                 :class="`${ml}-2`"
                 @click="$emit('change-stage', 1)">
            <span :class="`${mr}-2 hidden-lg-and-down`">{{ buttonForward }}</span>
            <fa-icon icon="arrow-alt-right" size="lg"/>
          </v-btn>
        </template>
        <span class="hidden-xl-only">{{ buttonForward }}</span>
      </v-tooltip>
    </div>

    <!-- Escalation dialog -->
    <escalation-dialog v-if="escalationDialog"
                       v-model="escalationDialog"
                       :form-code="form.UNFORMIO"
                       :form-definition="formDefinition"
                       @create-escalation="createEscalation"/>
  </div>
</template>

<script>
import { tasks } from '@/mixins/units'
import EscalationDialog from '../task-escalation/EscalationDialog'

export default {
  name: 'TaskControls',
  components: { EscalationDialog },
  mixins: [tasks],

  props: {
    buttonIsBlocked: Boolean,
    formVariables: [Object, null]
  },

  data: () => ({
    form: {},
    escalationParams: null,
    escalationDialog: false
  }),

  computed: {
    // BUTTONS FROM BACKEND FOR TASK TYPE "AGREE" and "WF"
    buttonExecute () {
      return this.task.completeButtonText ||
          this.$t('buttons.execute')
    },

    buttonBack () {
      return this.task.previousButtonText ||
          this.$t('buttons.back')
    },

    buttonForward () {
      return this.task.nextButtonText ||
          this.$t('buttons.forward')
    },

    buttonReject () {
      return this.task.previousButtonText ||
          this.$t('buttons.reject')
    },

    buttonApprove () {
      return this.task.nextButtonText ||
          this.$t('buttons.approve')
    },

    needShowTooltip () {
      return on =>
        this.$vuetify.breakpoint.mdAndDown ? on : ''
    },

    needEscalationMenu () {
      return this.escalations.length > 1
    },

    needShowEscalationMenu () {
      return on => this.needEscalationMenu ? on : ''
    }
  },

  methods: {
    getEscalation (escalation) {
      const { Code, HasForm } = escalation || this.escalations[0]
      this.escalationParams = {
        SmartManagerTaskId: this.taskId,
        UserTaskId: this.externalParams.EXTERNALID,
        EscalationCode: Code
      }

      if (HasForm) {
        this.getEscalationForm()
      } else {
        this.createEscalation()
      }
    },

    async getEscalationForm () {
      const params = {
        ...this.escalationParams,
        Variables: this.getVariables()
      }
      const form = await this.$store.dispatch('getEscalationForm', params)
      if (form) {
        this.form = form
        this.escalationDialog = true
      }
    },

    async createEscalation (variables) {
      const params = {
        ...this.escalationParams,
        Variables: this.getVariables(variables)
      }
      const result = await this.$store.dispatch('createEscalation', params)
      if (result.Success) {
        this.$emit('close-task')
      }
    },

    getVariables (variables) {
      this.$emit('get-variables')
      const formVariables = variables || this.formVariables
      if (formVariables) {
        return Object.entries(formVariables)
      }
      return null
    }
  }
}
</script>
