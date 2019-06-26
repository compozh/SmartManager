<template>
  <v-container fluid pa-0>
    <v-layout
      column
      id="desc"
      class="description-container"
    >
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
          :srcdoc="task.htmlDescript"
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
          :style="{ right: showHiddenDesc ? setBtnPosition : 'auto' }"
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
    props: ['task'],
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
      },
      setBtnPosition() {
        switch (this.$vuetify.breakpoint.name) {
          case 'lg':
            return '42%'
          case 'xl':
            return '45%'
        }
      }
    }
  }
</script>

<style scoped>
  .description-container {
    overflow: hidden;
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
    transition: height linear .2s;
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
    position: fixed;
    right: 15px;
    bottom: 15px;
  }

  .btn-no-fab {
    border-radius: 2px;
    height: 21px;
    width: 100%;
  }
</style>