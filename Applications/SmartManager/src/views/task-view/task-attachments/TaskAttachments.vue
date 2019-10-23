<template>
  <div class="flex flex-col h-full bg-white" ref="container">
    <div class="vx-row mx-3 p-3" ref="items">
      <div>
      </div>
      <div class="flex flex-wrap">
        <div
          class="mail__attachment my-1"
          v-for="(attachment, index) in attachments"
          :key="index"
          @click="currentFile = attachment"
        >
          <vx-tooltip
            :text="attachment.fileName"
            color="rgb(98, 98, 98, .95)"
          >
            <vs-chip
              :color="attachment.id === currentFile.id ? 'success' : 'primary'"
              class="mr-3 max-w-sm cursor-pointer"
            >
              <span class="flex mr-2">
                <file-icon :extention="attachment.fileExt"></file-icon>
              </span>
              <span class="custom-truncate">{{ attachment.fileName }}</span>
            </vs-chip>
          </vx-tooltip>
        </div>
      </div>
    </div>
    <component :is="viewer" :url="url"></component>
  </div>
</template>

<script>
import PdfViewer from '@/components/pdf-viewer/Viewer'
import ImgViewer from '@/components/ImageViewer'
import TxtViewer from '@/components/TextViewer'
import NotSupport from '@/components/NotSupport'
import FileIcon from '@/components/FileIcon'

export default {
  props: {
    attachments: Array,
    index: Number
  },
  components: {
    PdfViewer,
    ImgViewer,
    TxtViewer,
    NotSupport,
    FileIcon
  },
  data: () => ({
    currentFile: {}
  }),
  computed: {
    url() {
      if (!Object.keys(this.currentFile).length) {
        this.currentFile = this.attachments[this.index]
      }
      return this.currentFile.fileUrl
    },
    isImage() {
      const image = ['png', 'jpeg', 'jpg', 'bmp']
      return ext => image.some(i => i === ext)
    },
    isText() {
      const text = ['txt', 'log']
      return ext => text.some(i => i === ext)
    },
    viewer() {
      const ext = this.url.split('.').pop()
      switch (true) {
        case ext === 'pdf': return 'pdf-viewer'
        case this.isText(ext): return 'txt-viewer'
        case this.isImage(ext): return 'img-viewer'
        default: return 'not-support'
      }
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
