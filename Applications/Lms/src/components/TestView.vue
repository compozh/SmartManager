<template>
  <v-container py-0 >
    <v-layout
      class="height100">
      <component v-bind:is="currentComponent"></component>
    </v-layout>
  </v-container>
</template>

<script>
import testStart from './TestStart'
import testPassing from './TestPassing'
import testResults from './TestResults'

export default {
  name: 'test-view',
  props: {
    testGuid: String
  },
  async mounted() {
    this.expanedEl = this.$refs.task
    const success = await this.$store.dispatch('lms/getTestInfo', this.testGuid)
    if (success) {
      this.$store.commit('lms/setCurrentTestPage', 'test-start')
    } else {
      this.$store.commit('lms/setCurrentTestPage', 'error-message')
    }
  },
  beforeDestroy() {
    this.$store.commit('lms/setTestInfo', null)
  },
  data() {
    return {
      components: [
        testStart,
        testPassing,
        testResults
      ],
      collapse: true,
      expanedEl: null
    }
  },
  computed: {
    currentComponent() {
      let comp = this.$store.getters['lms/currentTestPage']
      return comp
    }
  }
}
</script>

<style>
.btn-over {
  position: absolute;
  bottom: 0;
  right: 0;
  transition: 0.7s;
  z-index: 99;
}
.screen {
  position: relative;
  display: block;
}
</style>
