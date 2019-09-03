<template>
<v-overlay class="downtimes-overlay">
  <v-card height="100%" width="100%" class="overlay-block" light>
      <div class="downtimes-block">
      <mes-form-builder
        ref="formioBuilder"
        type="downtimesForm"
        @formioSubmit=formioSubmit />
      </div>
    <v-btn
      class="close-overlay-btn"
      icon
      @click="closeOverlay"
    >
      <v-icon color="rgba(179, 2, 2, 0.81)">mdi-close</v-icon>
    </v-btn>
  </v-card>
  </v-overlay>
</template>

<script>
export default {
  name: 'mes-downtimes-overlay',
  created() {
    this.initializeDowntimeFormio()
  },
  computed: {
  },
  methods: {
    closeOverlay () {
      this.$store.dispatch('mes/changeDowntimesOverlay')
    },
    formioSubmit(data) {
      this.$store.dispatch('mes/downtimeFormIoSubmit', { workCenter: this.workCenter, data })
    },
    async initializeDowntimeFormio() {
      let workCenter = this.$parent.workCenter,
        properties = {
          workCenterCode: workCenter.code,
          workBarcode: '040000004620',
        }
      await this.$store.dispatch('mes/createDowntimeFormio', { formCode: workCenter.productionRegistrationFormCode, properties })
    },
  }
}
</script>

<style type="text/css" scoped>
  .overlay-content {
    height: 100%;
    width: 100%;
  }
  .close-overlay-btn {
    position: absolute;
    top: 0;
    right: 0;
  }
  .downtimes-block {
    display: flex;
    height: 100%;
    overflow-y: auto;
    width: 100%;
    background-color: #326da80d;
  }
  .downtimes-block::-webkit-scrollbar {
    background-color:#fff;
    width:16px
  }
  /* background of the scrollbar except button or resizer */
  .downtimes-block::-webkit-scrollbar-track {
    background-color:#fff
  }
  .downtimes-block::-webkit-scrollbar-track:hover {
    background-color:#f4f4f4
  }
  /* scrollbar itself */
  .downtimes-block::-webkit-scrollbar-thumb {
    background-color:#babac0;
    border-radius:16px;
    border:5px solid #fff
  }
  .downtimes-block::-webkit-scrollbar-thumb:hover {
    background-color:#a0a0a5;
    border:4px solid #f4f4f4
  }
  /* set button(top and bottom of the scrollbar) */
  .downtimes-block::-webkit-scrollbar-button {display:none}
</style>
