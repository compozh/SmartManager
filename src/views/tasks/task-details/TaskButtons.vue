<template>
  <div class="d-flex">
    <!-- EXECUTE BUTTON -->
    <v-tooltip top v-if="internalTaskInWork && taskType === ''">
      <template #activator="{ on }">
        <v-btn v-on="$vuetify.breakpoint.mdAndDown ? on : ''"
               color="success"
               small depressed
               @click="$emit('changeStatus', '+')">
          <fa-icon icon="check" size="lg"/>
          <span class="ml-2 hidden-md-and-down">{{ $t('buttons.execute') }}</span>
        </v-btn>
      </template>
      <span class="hidden-lg-and-up">{{ $t('buttons.execute') }}</span>
    </v-tooltip>

    <!-- EXECUTE BUTTON FOR EXTERNAL-->
    <v-tooltip top v-if="externalTaskCamunda">
      <template #activator="{ on }">
        <v-btn v-on="$vuetify.breakpoint.mdAndDown ? on : ''"
               color="success"
               small depressed
               @click="$emit('executeExternalTask')">
          <fa-icon icon="check" size="lg"/>
          <span class="ml-2 hidden-md-and-down">{{ $t('buttons.execute') }}</span>
        </v-btn>
      </template>
      <span class="hidden-lg-and-up">{{ $t('buttons.execute') }}</span>
    </v-tooltip>

    <!-- RETURN BUTTON -->
    <v-tooltip top v-if="taskCompleted">
      <template #activator="{ on }">
        <v-btn v-on="$vuetify.breakpoint.mdAndDown ? on : ''"
               color="warning"
               small depressed
               @click="$emit('changeStatus', '')">
          <fa-icon icon="undo" size="lg"/>
          <span class="ml-2 hidden-md-and-down">{{ $t('buttons.returnToWork') }}</span>
        </v-btn>
      </template>
      <span class="hidden-lg-and-up">{{ $t('buttons.returnToWork') }}</span>
    </v-tooltip>

    <!-- APPROVE/REJECT BUTTONS -->
    <div v-if="agreeTaskInWork || taskAtApproval">
      <v-tooltip top>
        <template #activator="{ on }">
          <v-btn v-on="$vuetify.breakpoint.lgAndDown ? on : ''"
                 color="error"
                 small depressed
                 @click="$emit('changeStatus', '-')">
            <fa-icon icon="thumbs-down" size="lg"/>
            <span class="ml-2 hidden-lg-and-down">{{ buttonReject }}</span>
          </v-btn>
        </template>
        <span class="hidden-xl-only">{{ buttonReject }}</span>
      </v-tooltip>

      <v-tooltip top>
        <template #activator="{ on }">
          <v-btn v-on="$vuetify.breakpoint.lgAndDown ? on : ''"
                 color="success"
                 small depressed
                 class="ml-2"
                 @click="$emit('changeStatus', '+')">
            <fa-icon icon="thumbs-up" size="lg"/>
            <span class="ml-2 hidden-lg-and-down">{{ buttonApprove }}</span>
          </v-btn>
        </template>
        <span class="hidden-xl-only">{{ buttonApprove }}</span>
      </v-tooltip>
    </div>

    <!-- FORWARD/BACK BUTTONS -->
    <div v-if="workFlowTaskInWork">
      <v-tooltip top>
        <template #activator="{ on }">
          <v-btn v-on="$vuetify.breakpoint.lgAndDown ? on : ''"
                 color="error"
                 small depressed
                 @click="$emit('changeStage', 0)">
            <fa-icon icon="arrow-alt-left" size="lg"/>
            <span class="ml-2 hidden-lg-and-down">{{ buttonBack }}</span>
          </v-btn>
        </template>
        <span class="hidden-xl-only">{{ buttonBack }}</span>
      </v-tooltip>
      <v-tooltip top>
        <template #activator="{ on }">
          <v-btn v-on="$vuetify.breakpoint.lgAndDown ? on : ''"
                 color="success"
                 small depressed
                 class="ml-2"
                 @click="$emit('changeStage', 1)">
            <span class="mr-2 hidden-lg-and-down">{{ buttonForward }}</span>
            <fa-icon icon="arrow-alt-right" size="lg"/>
          </v-btn>
        </template>
        <span class="hidden-xl-only">{{ buttonForward }}</span>
      </v-tooltip>
    </div>
  </div>
</template>

<script>
import { tasks } from '@/mixins/units'

export default {
  name: 'TaskButtons',
  mixins: [tasks],
  computed: {
    // BUTTONS FROM BACKEND FOR TASK TYPE "AGREE" and "WF"
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
    }
  }
}
</script>

<style scoped>

</style>
