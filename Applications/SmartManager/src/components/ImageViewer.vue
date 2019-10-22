<template>
  <div class="flex flex-col flex-1 justify-center items-center h-full overflow-hidden viewer-wrapper">
    <viewer :options="options"
            :images="[url]"
            @inited="init"
            class="flex flex-col flex-1 justify-center items-center h-full viewer">
      <template slot-scope="scope">
        <img v-for="src in scope.images"
             :src="src"
             :key="src"
             :class="{hidden: !options.background}">
      </template>
    </viewer>
  </div>
</template>
<script>

import 'viewerjs/dist/viewer.css'
import Viewer from 'v-viewer/src/component.vue'
import ViewerP from 'v-viewer'
import Vue from 'vue'
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
      url: 'data-source'
    },
  }),
  methods: {
    init(viewer) {
      this.$viewer = viewer
    }
  }
}
</script>
