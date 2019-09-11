<template>
  <div class="mes-downtimes-component">
    <v-layout column class="mes-downtimes-component-layout">
      <v-flex class="downtimes-list-blocks">
        <mes-content-loader
          v-if="!initializeDowntimes && !downtimes.length"
          :loaderType=loaderType
        />
        <div class="downtimes-list-block-content">
          <mes-downtime-cards
          @changeCurrentDowntime=changeCurrentDowntime
          />

        </div>
        <span v-if="initializeDowntimes && !downtimes.length" class="lack-of-downtimes-str">Простои отсутствуют</span>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>

export default {
  name: 'mes-downtimes-component',
  data() {
    return {
      loaderType: 'list',
    }
  },
  props: {
    initializeDowntimes: Boolean,
  },
  computed: {
    downtimes() {
      return this.$store.getters['mes/downtimes']
    }
  },
  methods: {
    changeCurrentDowntime(newDowntime) {
      this.$emit('changeCurrentDowntime', newDowntime)
    },
  }
}
</script>

<style type="text/css" scoped>
.mes-downtimes-component {
    height: 100%;
    width: 30%;
    min-width: 330px
  }
  .mes-downtimes-component-layout {
    height: 100%;
  }

  .downtimes-list-block-content {
    height:100%;
    overflow-y: auto;
    position: absolute;
    width: 100%;
  }

  .downtimes-list-block-content::-webkit-scrollbar {
    background-color:#fff;
    width:16px
  }
  .v-card__text.active-task-item {
    border-top-left-radius: none !important;
    border-top-right-radius: none !important;
  }
  /* background of the scrollbar except button or resizer */
  .downtimes-list-block-content::-webkit-scrollbar-track {
    background-color:#fff
  }
  .downtimes-list-block-content::-webkit-scrollbar-track:hover {
    background-color:#f4f4f4
  }

  /* scrollbar itself */
  .downtimes-list-block-content::-webkit-scrollbar-thumb {
    background-color:#babac0;
    border-radius:16px;
    border:5px solid #fff
  }
  .downtimes-list-block-content::-webkit-scrollbar-thumb:hover {
    background-color:#a0a0a5;
    border:4px solid #f4f4f4
  }
  /* set button(top and bottom of the scrollbar) */
  .downtimes-list-block-content::-webkit-scrollbar-button {display:none}

  .lack-of-downtimes-str {
    font-size: 2em;
    font-weight: 500;
    color: #3d83f7;
    opacity: 0.5;
    padding-left: 10px;
  }
</style>
