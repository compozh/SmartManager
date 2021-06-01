<template>
  <div class="d-flex align-center flex-wrap mt-3">
    <div v-if="task.taskType !== 'EXTERNAL' && task.status !== ''"
         :class="`d-flex mb-3 ${mr}-2`">
      <v-chip small label
              text-color="white"
              :color="taskStatus().color">
        <fa-icon :icon="taskStatus().icon" :class="`${mr}-3`"/>
        {{ taskStatus().text }}
      </v-chip>
      <v-divider vertical :class="`${ml}-2`"/>
    </div>
    <div v-if="task.priority" :class="`d-flex mb-3 ${mr}-2`">
      <v-chip small label
              color="warning"
              text-color="white">
        <fa-icon icon="exclamation-square" :class="`${mr}-3`"/>
        {{ $t('icons.priority') }}
      </v-chip>
      <v-divider vertical :class="`${ml}-2`"/>
    </div>
    <div v-if="task.myControl" :class="`d-flex mb-3 ${mr}-2`">
      <v-chip small label
              color="red darken-4"
              text-color="white">
        <fa-icon icon="eye" :class="`${mr}-3`"/>
        {{ $t('icons.control') }}
      </v-chip>
    </div>
    <div v-if="task.needComment" :class="`d-flex mb-3 ${mr}-2`">
      <v-divider vertical class="mx-2"/>
      <v-chip small label
              color="green"
              text-color="white">
        <fa-icon icon="comment-alt-lines" :class="`${mr}-3`"/>
        {{ $t('icons.needComment') }}
      </v-chip>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TaskLabels',
  props: {
    task: Object
  },
  computed: {
    taskStatus () {
      return () => {
        switch (this.task.status) {
          case '*':
            return {
              color: 'primary',
              icon: 'recycle',
              text: this.$t('statuses.inProgress')
            }
          case '-':
            return {
              color: 'error',
              icon: 'exclamation-circle',
              text: this.$t('statuses.rejected')
            }
          case '+':
            return {
              color: 'success',
              icon: 'check-circle',
              text: this.$t('statuses.done')
            }
          case '#':
            return {
              color: 'yellow darken-2',
              icon: 'file-search',
              text: this.$t('statuses.review')
            }
          default:
            return {
              color: 'grey',
              icon: 'times',
              text: this.$t('statuses.undefined')
            }
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
