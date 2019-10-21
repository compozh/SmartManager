<template>
  <VuePerfectScrollbar
    class="scroll-area md:px-8 p-4"
    :settings="settings"
  >
    <div class="vx-row h-full">
      <div class="vx-col w-full h-full">
        <vx-card class="px-4 h-full">

          <pdf-viewer :url="url"></pdf-viewer>

        </vx-card>
      </div>
    </div>
  </VuePerfectScrollbar>
</template>

<script>
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import { FileIcon } from 'vue-feather-icons'
import PdfViewer from '@/components/pdf-viewer/Viewer'

export default {
  props: {
    attachments: Array,
    url: String
  },
  components: {
    VuePerfectScrollbar,
    FileIcon,
    PdfViewer
  },
  data: () => ({
    //url: 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf',
    currentFile: {},
    settings: {
      maxScrollbarLength: 60,
      wheelSpeed: 0.50,
    },
  }),
  computed: {
    // viewAttachment() {
    //   if (Object.keys(this.currentFile).length) {
    //     return this.currentFile
    //   }
    //   return this.currentFile = this.attachments[this.index]
    // }
  }
}
</script>

<style scoped>

  .vx-card >>> .vx-card__collapsible-content.vs-con-loading__container,
  .vx-card >>> .vx-card__collapsible-content .vx-card__body {
    height: 100%;
    padding: 0;
  }

  .custom-truncate {
    display: block;
    max-width: 100px;
    margin: 0;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    white-space: nowrap !important;
  }


</style>
