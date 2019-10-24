<template>
  <div class="mes-qualities-component">
    <v-layout column class="mes-qualities-component-layout">
      <v-flex class="qualities-list-blocks">
        <mes-content-loader
          v-if="!initializeQualities && !qualities.length"
          :loaderType=loaderType
        />
        <div class="qualities-list-block-content" @scroll.passive="onScroll">
          <mes-quality-cards
          @changeCurrentQuality=changeCurrentQuality
          />
          <span v-if="isUploadInProcess" class='upload-quality-str'>Загрузка простоев</span>
        </div>
        <span v-if="initializeQualities && !qualities.length" class="lack-of-qualities-str">Простои отсутствуют</span>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
export default {
  name: 'mes-quality-component',
  data() {
    return {
      loaderType: 'list',
    }
  },
  props: {
    isUploadInProcess: Boolean,
    initializeQualities: Boolean,
  },
  computed: {
    qualities() {
      return this.$store.getters['mes/qualities']
    }
  },
  methods: {
    changeCurrentQuality(newQuality) {
      this.$emit('changeCurrentQuality', newQuality)
    },
    onScroll(e) {
      const me = this
      let blockHeight = e.target.scrollHeight
      let blockTop = e.target.scrollTop + 100
      let clientHeight = e.target.clientHeight
      if (!me.isUploadInProcess && blockHeight - blockTop >= clientHeight - 20 && blockHeight - blockTop <= clientHeight + 20) {
        let lastQualityDate = me.qualities[me.qualities.length - 1].eventStart
        me.$emit('uploadQualityOnScroll', lastQualityDate)
      }
    }
  }
}
</script>

<style type="text/css" scoped>
.mes-qualities-component {
    height: 100%;
    width: 30%;
    min-width: 330px
  }
  .mes-qualities-component-layout {
    height: 100%;
  }

  .qualities-list-block-content {
    height:100%;
    overflow-y: auto;
    position: absolute;
    width: 100%;
  }

  .qualities-list-block-content::-webkit-scrollbar {
    background-color:#fff;
    width:16px
  }
  .v-card__text.active-task-item {
    border-top-left-radius: none !important;
    border-top-right-radius: none !important;
  }
  /* background of the scrollbar except button or resizer */
  .qualities-list-block-content::-webkit-scrollbar-track {
    background-color:#fff
  }
  .qualities-list-block-content::-webkit-scrollbar-track:hover {
    background-color:#f4f4f4
  }

  /* scrollbar itself */
  .qualities-list-block-content::-webkit-scrollbar-thumb {
    background-color:#babac0;
    border-radius:16px;
    border:5px solid #fff
  }
  .qualities-list-block-content::-webkit-scrollbar-thumb:hover {
    background-color:#a0a0a5;
    border:4px solid #f4f4f4
  }
  /* set button(top and bottom of the scrollbar) */
  .qualities-list-block-content::-webkit-scrollbar-button {display:none}

  .upload-quality-str {
    display: flex;
    justify-content: center;
    text-transform: uppercase;
    font-size: 13px;
    color: #326da8;
    font-weight: 400;
  }

  .lack-of-qualities-str {
    font-size: 2em;
    font-weight: 500;
    color: #3d83f7;
    opacity: 0.5;
    padding-left: 10px;
  }
</style>
