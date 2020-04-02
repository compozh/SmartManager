<template>
  <v-container ref="task" pa-0 ma-0>
      <v-layout column fill-height justify-space-between>
        <v-flex class="overflow-y">
          <quill
            v-model="task"
            :config="config"></quill>
        </v-flex>
        <v-flex shrink align-self-end>
          <v-btn fab dark
            color="grey"
            @click="toggleFullScreen">
            <v-icon v-if="collapse">fullscreen</v-icon>
            <v-icon v-else>fullscreen_exit</v-icon>
          </v-btn>
        </v-flex>
      </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'task-view',
  props: {
    task: Object,
    config: Object
  },
  data() {
    return {
      collapse: true,
      expanedEl: null
    }
  },
  mounted() {
    this.expanedEl = this.$refs.task // document.getElementById('task')
  },
  methods: {
    toggleFullScreen() {
      this.collapse = false
      var fullScreenElement =
        document.fullscreenElement || document.mozFullscreenElement || document.webkitFullscreenElement
      if (!fullScreenElement) {
        if (this.expanedEl.requestFullscreen) {
          this.expanedEl.requestFullscreen()
        } else if (this.expanedEl.mozRequestFullscreen) {
          this.expanedEl.mozRequestFullscreen
        } else if (this.expanedEl.webkitRequestFullScreen) {
          this.expanedEl.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT)
        }
      } else {
        this.collapse = true
        if (document.cancelFullScreen) {
          document.cancelFullScreen()
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen()
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen()
        }
      }

    },
  }
}
</script>

<style>
.overflow-y {
  overflow-y:auto;
}
:full-screen {
  background: white;
}
:-webkit-full-screen {
  background: white;
}
:-moz-full-screen {
  background: white;
}
</style>
