<template>
  <div class="flex flex-col h-full bg-white" ref="container">
    <div class="vx-row m-0 px-6 py-3" ref="items">
      <div>
      </div>
      <div class="flex flex-wrap">
        <div
          class="my-1"
          v-for="(attachment, index) in task.originals"
          :key="index"
          @click="getUrl(attachment)"
        >
          <vx-tooltip
            class="custom-tooltip"
            :text="attachment.fileName"
            color="rgb(98, 98, 98, .95)"
          >
            <vs-chip
              :color="attachment.id === fileId ? 'warning' : 'primary'"
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
    <component :is="viewer" :url="fileUrl"></component>
  </div>
</template>

<script>
import PdfViewer from '@/components/pdf-viewer/Viewer'
import ImgViewer from '@/components/ImageViewer'
import TxtViewer from '@/components/TextViewer'
import NotSupport from '@/components/NotSupport'
import NoData from '@/components/NoData'
import FileIcon from '@/components/FileIcon'

export default {
  props: {
    task: Object,
    index: Number
  },
  components: {
    PdfViewer,
    ImgViewer,
    TxtViewer,
    NotSupport,
    NoData,
    FileIcon
  },
  data: () => ({
    fileId: 0,
    fileUrl: ''
  }),
  created() {
    if (!this.fileId && this.originals) {
      const attachment = this.originals[this.index]
      this.fileId = attachment.id || 0
      this.getUrl(attachment)
    }
  },
  computed: {
    originals() {
      return this.task.originals.length
        ? this.task.originals
        : null
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
      if (this.fileUrl) {
        const ext = this.fileUrl.split('.').pop()
        switch (true) {
          case ext === 'pdf': return 'pdf-viewer'
          case this.isText(ext): return 'txt-viewer'
          case this.isImage(ext): return 'img-viewer'
          default: return 'not-support'
        }
      }
      return 'no-data'
    }
  },
  methods: {
    async getUrl({id: fileId, fileExt, fileUrl}) {
      const id = this.$route.params.id
      this.fileId = fileId
      this.fileUrl = fileUrl || await this.$store.dispatch('sm/getFileUrl', {fileId, fileExt, id})
    }
  }
}
</script>

<style>

  .vs-tooltip {
    max-width: 300px !important;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .custom-truncate {
    max-width: 200px;
    margin: 0;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    white-space: nowrap !important;
    justify-content: flex-start;
  }

</style>
