<template>
<v-layout class="downtime-layout">
  <v-flex class="downtime-flex">
    <mes-form-builder
      v-if="selectedDowntime"
      ref="formioBuilder"
      @formioSubmit=formioSubmit
      :formioData=downtimeFormio
      :formCode=workCenter.downtimeRegistrationFormCode
    />
    </v-flex>
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
    }
  }
}
</script>
<style type="text/css" scoped>
.downtime-layout {
  width: 100%;
  height: 100%;
}
.downtime-flex {
    position: absolute;
    height: 100%;
    overflow-y: auto;
    width: 100%;
  }
  .downtime-flex::-webkit-scrollbar {
    background-color:#fff;
    width:16px
  }
  .downtime-flex::-webkit-scrollbar-track {
      background-color:#fff
  }
  .downtime-flex::-webkit-scrollbar-track:hover {
      background-color:#f4f4f4
  }

  /* scrollbar itself */
 .downtime-flex::-webkit-scrollbar-thumb {
      background-color:#babac0;
      border-radius:16px;
      border:5px solid #fff
  }
  .downtime-flex::-webkit-scrollbar-thumb:hover {
      background-color:#a0a0a5;
      border:4px solid #f4f4f4
  }

  /* set button(top and bottom of the scrollbar) */
  .downtime-flex::-webkit-scrollbar-button {display:none}
</style>
