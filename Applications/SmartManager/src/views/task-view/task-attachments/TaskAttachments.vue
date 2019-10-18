<template>
  <VuePerfectScrollbar
    class="scroll-area md:px-8 pt-4 px-6 mb-4"
    :settings="settings"
  >
    <pdf-viewer :url="url"></pdf-viewer>

  </VuePerfectScrollbar>
</template>

<script>
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import { FileIcon } from 'vue-feather-icons'
import PdfViewer from '@/components/pdf-viewer/Viewer'

export default {
  props: {
    attachments: Array,
    url: Number
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


  .custom-truncate {
    display: block;
    max-width: 100px;
    margin: 0;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    white-space: nowrap !important;
  }


</style>
