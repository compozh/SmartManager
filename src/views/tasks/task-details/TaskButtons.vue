<template>
  <div class="d-flex">
    <!-- EXECUTE BUTTON -->
    <v-btn v-if="internalTaskInWork && taskType === ''"
           color="success"
           small depressed
           @click="$emit('changeStatus', '+')">
      <fa-icon icon="check" size="lg"/>
      <span class="ml-2 hidden-md-and-down">{{ $t('buttons.execute') }}</span>
    </v-btn>

    <!-- EXECUTE BUTTON FOR EXTERNAL-->
    <v-btn v-if="externalTaskCamunda"
           color="success"
           small depressed
           @click="$emit('executeExternalTask')">
      <fa-icon icon="check" size="lg"/>
      <span class="ml-2 hidden-md-and-down">{{ $t('buttons.execute') }}</span>
    </v-btn>

    <!-- RETURN BUTTON -->
    <v-btn v-if="taskCompleted"
           color="warning"
           small depressed
           @click="$emit('changeStatus', '')">
      <fa-icon icon="undo" size="lg"/>
      <span class="ml-2 hidden-md-and-down">{{ $t('buttons.returnToWork') }}</span>
    </v-btn>

    <!-- APPROVE/REJECT BUTTONS -->
    <div v-if="agreeTaskInWork || taskAtApproval">
      <v-btn color="error"
             small depressed
             @click="$emit('changeStatus', '-')">
        <fa-icon icon="thumbs-down" size="lg"/>
        <span class="ml-2 hidden-lg-and-down">{{ buttonReject }}</span>
      </v-btn>

      <v-btn color="success"
             small depressed
             class="ml-2"
             @click="$emit('changeStatus', '+')">
        <fa-icon icon="thumbs-up" size="lg"/>
        <span class="ml-2 hidden-lg-and-down">{{ buttonApprove }}</span>
      </v-btn>
    </div>

    <!-- FORWARD/BACK BUTTONS -->
    <div v-if="workFlowTaskInWork">
      <v-btn color="error"
             small depressed
             @click="$emit('changeStage', 0)">
        <fa-icon icon="arrow-alt-left" size="lg"/>
        <span class="ml-2 hidden-lg-and-down">{{ buttonBack }}</span>
      </v-btn>

      <v-btn color="success"
             small depressed
             class="ml-2"
             @click="$emit('changeStage', 1)">
        <span class="mr-2 hidden-lg-and-down">{{ buttonForward }}</span>
        <fa-icon icon="arrow-alt-right" size="lg"/>
      </v-btn>
    </div>
  </div>
</template>

<script>
import { tasks } from '@/mixins/units'

export default {
  name: 'TaskButtons',
  mixins: [tasks],
  computed: {
    taskType () {
      return this.task.taskType
    },
    taskInWork () {
      return this.task.status === '' ||
        this.task.status === '*'
    },
    taskAtApproval () {
      return this.task.status === '#'
    },
    internalTask () {
      return this.taskType === '' ||
        this.taskType === 'AGREE' ||
        this.taskType === 'WORKFLOW'
    },
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
