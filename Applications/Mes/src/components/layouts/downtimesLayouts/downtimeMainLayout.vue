<template>
<v-layout class="downtime-layout">
  <mes-form-builder
    v-if="selectedDowntime"
    ref="formioBuilder"
    @formioSubmit=formioSubmit
    :formioData=downtimeFormio
    />
  </v-layout>
</template>

<script>

export default {
  name: 'mes-downtime-main-layout',
  computed: {
    selectedDowntime() {
      return this.$store.getters['mes/selectedDowntime']
    },
    workCenter() {
      return this.$store.getters['mes/workCenter']
    },
    downtimeFormio() {
      return this.$store.getters['mes/downtimeFormio']
    }
  },
  methods: {
    formioSubmit(data) {
      this.$store.dispatch('mes/downtimeFormIoSubmit', { workCenter: this.workCenter, data, downtime: this.selectedDowntime })
    },
    getFormioData() {
      return this.$refs.formioBuilder[0].getFormioData()
    },
  }
}
</script>
<style type="text/css" scoped>
</style>
