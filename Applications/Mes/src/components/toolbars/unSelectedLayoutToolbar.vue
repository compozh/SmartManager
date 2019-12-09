<template>
    <v-layout row lg12 xs12 md12 sm12 show-arrows class="toolbar">
        <v-flex class="toolbar-basebuttons">
            <v-btn class="downtime-registration-button" outlined @click="changeDowntimesOverlayVisible" color="rgba(179, 2, 2, 0.81)">{{this.$t('mes.buttons.Downtime')}}</v-btn>
        </v-flex>
    </v-layout>
</template>

<script>

export default {
  name: 'mes-un-selected-layout-toolbar',
  computed: {
    downtimesOverlay: {
      get() {
        return this.$store.getters['mes/downtimesOverlay']
      },
      set() {
        this.$store.dispatch('mes/changeDowntimesOverlay')
      }
    }
  },
  methods: {
    changeDowntimesOverlayVisible() {
      this.$emit('changeDowntimesOverlayVisible')
    }
  }
}
</script>

<style type="text/css" scoped>
  .toolbar {
    display: flex;
    flex-wrap: nowrap;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    margin: 0;
  }
  .toolbar-basebuttons {
    display: flex;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
    height: 63px;
    border-bottom: 1px solid rgba(2, 2, 2, 0.08);
  }
  .v-btn.v-btn--outlined {
    height: 50px;
  }
  .downtime-registration-button {
    border-radius: 5px;
    margin-left: 20px;
  }
</style>
