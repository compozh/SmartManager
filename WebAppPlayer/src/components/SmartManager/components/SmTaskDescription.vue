<template>
  <v-container fluid pa-0>
    <v-layout
      column
      id="desc"
      class="description-container"
    >
      <v-flex
        xs12
        class="text-xs-left description-headline blue-grey--text pa-1"
      >ОПИСАНИЕ:</v-flex>

      <v-flex
        xs12
        class="iframe-container"
        :class="{'show-after': !showHiddenDesc && compareDescHeight}"
      >
        <iframe
          seamless
          scrolling="no"
          width="100%"
          :height="setDescriptionHeight"
          frameborder="0"
          :srcdoc="description"
          @load="iFrameOnLoad"
        ></iframe>
      </v-flex>
      <v-flex
        v-if="compareDescHeight"
        class="btn-more-container"
      >
        <v-btn
          outline small
          class="btn-more"
          :fab="showHiddenDesc"
          @click="showHiddenDesc = !showHiddenDesc"
          :class="{'btn-no-fab': !showHiddenDesc}"
        >
          {{ showHiddenDesc ? '' : 'Показать больше' }}
          <v-icon v-if="!showHiddenDesc" size="18">keyboard_arrow_down</v-icon>
          <v-icon v-if="showHiddenDesc">keyboard_arrow_up</v-icon>
        </v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    name: "sm-task-description",
    props: ['description'],
    data: () => ({
      defaultDescHeight: 250,
      iFrameHeight: '',
      showHiddenDesc: false,
    }),
    methods: {
      iFrameOnLoad(event) {
        this.iFrameHeight = event.path[0].contentDocument.body.scrollHeight
      }
    },
    computed: {
      compareDescHeight() {
        return this.iFrameHeight > this.defaultDescHeight
      },
      setDescriptionHeight() {
        return this.showHiddenDesc || !this.compareDescHeight
          ? this.iFrameHeight + 5
          : this.defaultDescHeight
      }
    }
  }
</script>

<style scoped>
  .description-headline {
    font-size: 11px;
    border-bottom: 3px double #b4d2f0;
  }

  .description-container {
    overflow: hidden;
    box-shadow: inset 0 -1px 0 rgba(100, 121, 143, 0.122);
  }

  .iframe-container {
    position: relative;
  }

  .show-after.iframe-container:after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    height: 25px;
    width: 100%;
    background: linear-gradient(0deg, rgb(255, 255, 255) 20%, rgba(255, 255, 255, 0) 100%);
  }

  iframe {
    transition: height linear .3s;
  }

  .btn-more {
    margin: 3px 0;
    padding: 0;
    text-transform: none;
    font-weight: 300;
    color: #666;
    background-color: #f5f5f5 !important;
    border-color: #c6c6c6;
  }

  .btn-more.v-btn--floating {
    position: absolute;
    right: 5px;
    bottom: -5px;
  }

  .btn-no-fab {
    border-radius: 2px;
    height: 21px;
    width: 100%;
  }
</style>