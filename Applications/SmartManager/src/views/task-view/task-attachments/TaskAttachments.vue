<template>
  <div class="flex flex-col h-full bg-white" ref="container">
        <VuePerfectScrollbar
          class="scroll-area my-2"
          :settings="settings"
          style="height: auto; max-height: 15%">
      <div class="vx-row m-0 px-6" ref="items">
          <div class="flex flex-wrap">
            <div
              class="my-1"
              v-for="(attachment, index) in task.originals"
              :key="index"
              @click="getUrl(attachment)">
              <vx-tooltip
                class="custom-tooltip"
                :text="attachment.fileName"
                color="rgb(98, 98, 98, .95)">
                <vs-chip
                  :color="attachment.id === fileId ? 'warning' : 'primary'"
                  class="mr-3 max-w-sm cursor-pointer">
                  <span class="flex mr-2">
                    <file-icon :extention="attachment.fileExt"></file-icon>
                  </span>
                  <span class="custom-truncate">{{ attachment.fileName }}</span>
                </vs-chip>
              </vx-tooltip>
            </div>
          </div>
      </div>
        </VuePerfectScrollbar>
    <component :is="viewer" :url="fileUrl"></component>
  </div>
</template>

<script>
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import NotSupport from '@/components/NotSupport'
import NoData from '@/components/NoData'
import FileIcon from '@/components/FileIcon'

const PdfViewer = () => import('@/components/pdf-viewer/Viewer')
const ImgViewer = () => import('@/components/ImageViewer')
const TxtViewer = () => import('@/components/TextViewer')

export default {
  props: {
    task: Object,
    index: Number
  },
  components: {
    PdfViewer,
    ImgViewer,
    TxtViewer,
    VuePerfectScrollbar,
    NotSupport,
    NoData,
    FileIcon
  },
  data: () => ({
    fileId: 0,
    fileUrl: '',
    types: [],
    settings: {
      maxScrollbarLength: 60,
      wheelSpeed: 0.50,
    }
  }),
  created() {
    if (!this.fileId && this.originals) {
      const attachment = this.originals[this.index]
      this.fileId = attachment.id || 0
      this.getUrl(attachment)
      this.getAttachmentTypes()
    }
  },
  computed: {
    originals() {
      return this.task.originals.length
        ? this.task.originals
        : null
    },
    isImage() {
      const image = ['png', 'jpeg', 'jpg', 'webp', 'bmp', 'gif']
      return ext => image.some(i => i === ext)
    },
    isText() {
      const text = ['txt', 'log', 'ini', 'dll', 'bat', 'config', 'json']
      return ext => text.some(i => i === ext)
    },
    viewer() {
      if (this.fileUrl) {
        const ext = this.fileUrl.split('.').pop().toLowerCase()
        switch (true) {
          case ext === 'pdf': return 'pdf-viewer'
          case this.isText(ext): return 'txt-viewer'
          case this.isImage(ext): return 'img-viewer'
          default: return 'not-support'
        }
      }
      return 'no-data'
    },
    type() {
      if (this.task.__typename === 'Task') {
        return this.task.isGenerate ? 'DOCUMENT' : 'TASK'
      }
      if (this.task.__typename === 'Case') {
        return 'CASE'
      }
      return ''
    }
  },
  methods: {
    async getUrl({id: fileId, fileExt, fileUrl}) {
      const id = this.$route.params.id
      this.fileId = fileId
      this.fileUrl = fileUrl || await this.$store.dispatch('sm/getFileUrl', {fileId, fileExt, id})
    },
    async getAttachmentTypes() {
      const params = {
        type: this.type,
        id: this.task.id || this.$route.params.id,
        arso: this.task.arso,
        keyValue: this.task.keyValue,
        kidCopy: this.task.kidCopy
      }
      const result = await this.$store.dispatch('sm/getAttachmentTypes', params)
      this.types = result.data
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
