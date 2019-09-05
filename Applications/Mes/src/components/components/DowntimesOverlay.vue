<template>
<v-overlay class="downtimes-overlay">
  <v-card class="overlay-block" light>
    <v-card-title
      class="headline grey lighten-2"
      primary-title
    >
      Фиксация простоя
    </v-card-title>
      <div class="downtimes-block">
        <v-progress-circular
          class='downtime-progress-circular'
          v-if="!initializing"
          indeterminate
          color="primary"
      ></v-progress-circular>
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
      <v-icon color="rgba(179, 2, 2, 0.81)">close</v-icon>
    </v-btn>
  </v-card>
  </v-overlay>
</template>

<script>
export default {
  data () {
    return { initializing: false }
  },
  name: 'mes-downtimes-overlay',
  created() {
    this.initializeDowntimeTypes()
    this.initializeDowntimeFormio()
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
          id: 0,
          eventCode: '',
          eventStart: new Date()
        }
      await this.$store.dispatch('mes/createDowntimeFormio', { formCode: workCenter.downtimeRegistrationFormCode, properties })
      this.initializing = true
    },
    async initializeDowntimeTypes() {
      var downtimeTypes = await this.$store.dispatch('mes/createDowntimeTypes')
    }
  }
}
</script>

<style type="text/css" scoped>
  .overlay-block {
    height: 100%;
    width: 100%;
    min-width: 300px;
  }
  .close-overlay-btn {
    position: absolute;
    top: 4px;
    right: 0;
  }
  .downtimes-block {
    display: flex;
    height: 100%;
    overflow-y: auto;
    width: 100%;
    padding: 30px;
    /* background-color: #326da80d; */
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
  .downtime-progress-circular {
    position: absolute;
    left: 130px;
    top: 70px;
  }
</style>
