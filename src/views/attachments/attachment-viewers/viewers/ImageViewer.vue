<template>
  <div class="fill-height">
    <viewer :options="options"
            :images="[url]"
            @inited="init"
            class="fill-height">
      <template v-slot="{ images }">
        <img v-for="src in images"
             :src="src"
             :key="src"
             :class="{'d-none': !options.background}">
      </template>
    </viewer>
  </div>
</template>

<script>
import Vue from 'vue'
import ViewerP from 'v-viewer'
import 'viewerjs/dist/viewer.css'

const Viewer = () => import('v-viewer/src/component.vue')

Vue.use(ViewerP, {
  defaultOptions: {
    zIndex: 99999
  }
})

export default {
  components: {
    Viewer
  },
  props: {
    url: String
  },
  data: () => ({
    options: {
      inline: true,
      button: true,
      navbar: false,
      title: false,
      toolbar: true,
      tooltip: true,
      movable: true,
      zoomable: true,
      rotatable: true,
      scalable: true,
      transition: true,
      fullscreen: true,
      keyboard: true,
      background: false,
      url: 'src'
    }
  }),
  methods: {
    init (viewer) {
      this.$viewer = viewer
    }
  }
}
</script>

<style lang="scss">

  div {
    .viewer-container {
      &.viewer-backdrop {
        background-color: #fff !important;
        width: 100% !important;
      }

      &.viewer-fixed {
        background-color: rgba(0, 0, 0, .5) !important;
      }
      // hide unused buttons
      .viewer {
        &-one-to-one, &-prev, &-play, &-next {
          display: none;
        }
      }
    }
  }

</style>
