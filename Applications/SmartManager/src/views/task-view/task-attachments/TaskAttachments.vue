<template>
  <VuePerfectScrollbar
    class="scroll-area md:px-8 pt-4 px-6 mb-4"
    :settings="settings"
  >
    <div class="vx-row h-full">
      <div class="vx-col w-full">
        <vx-card class="px-4 h-full">
          <!-- TASK ATTACHMENTS -->
          <div class="vx-row">
            <div>
            </div>
            <div class="flex flex-wrap">
              <div
                class="mail__attachment my-1"
                v-for="(attachment, index) in attachments"
                :key="index"
                @click="currentFile = attachment"
              >
                <vx-tooltip :text="attachment.fileName" color="rgb(98, 98, 98, .95)">
                  <vs-chip
                    :color="attachment.id === currentFile.id ? 'warning' : 'primary'"
                    class="mr-3 max-w-sm cursor-pointer"
                  >
                    <span class="flex mr-1"><file-icon size="1.6x"></file-icon></span>
                    <span class="custom-truncate">{{ attachment.fileName }}</span>
                  </vs-chip>
                </vx-tooltip>
              </div>
            </div>
          </div>
          <div class="vx-row">
            <vs-divider/>
            <div class="vx-col w-full flex">
              <pdf-viewer class="viewer"></pdf-viewer>
<!--              <vs-list>-->
<!--                <vs-list-item-->
<!--                  v-for="(field, index) in viewAttachment"-->
<!--                  :key="index"-->
<!--                  :title="index"-->
<!--                >{{ field }}</vs-list-item>-->
<!--              </vs-list>-->
            </div>
          </div>
          <div class="vx-col w-full flex">
              <img class="w-full" :src="currentFile.fileUrl">
          </div>
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
    index: Number
  },
  components: {
    VuePerfectScrollbar,
    FileIcon,
    PdfViewer
  },
  data: () => ({
    currentFile: {},
    settings: {
      maxScrollbarLength: 60,
      wheelSpeed: 0.50,
    },
  }),
  computed: {
    viewAttachment() {
      if (Object.keys(this.currentFile).length) {
        return this.currentFile
      }
      return this.currentFile = this.attachments[this.index]
    }
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
