<template>
  <div class="d-flex align-center">
    <fa-icon icon="tags" :class="`${mr}-3`" size="lg" rotation="90"/>
    <span :class="`${mr}-3 font-weight-light`">
      {{ $t('statuses.currentStatus').toUpperCase() }}:
    </span>
    <v-chip small label
            text-color="white"
            :color="caseStatus().color">
      <fa-icon :icon="caseStatus().icon" :class="`${mr}-3`"/>
      {{ caseStatus().text }}
    </v-chip>
  </div>
</template>

<script>

export default {
  name: 'CaseStatus',
  props: {
    status: String
  },
  computed: {
    caseStatus () {
      return () => {
        switch (this.status) {
          case '':
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
