<template>
    <div class="fill-height">
      <component v-if=viewer :is="viewer" :url="attachmentDetails.url"/>
      <no-data v-else class="fill-height">
        <span v-if="attachmentDetails.reason"
              class="headline font-weight-light grey--text">
          {{ attachmentDetails.reason }}
        </span>
      </no-data>
    </div>
</template>

<script>
import NotSupport from './NotSupport'
import NoData from './NoData'
import { tasks, attachments } from '@/mixins/units'

const PdfViewer = () => import('./viewers/pdf-viewer/Viewer')
const ImgViewer = () => import('./viewers/ImageViewer')
const TxtViewer = () => import('./viewers/TextViewer')

export default {
  components: {
    PdfViewer,
    ImgViewer,
    TxtViewer,
    NotSupport,
    NoData
  },
  mixins: [tasks, attachments],
  computed: {
    isImage () {
      const image = ['png', 'jpeg', 'jpg', 'webp', 'bmp', 'gif']
      return ext => image.some(i => i === ext)
    },
    isText () {
      const text = ['txt', 'log', 'ini', 'dll', 'bat', 'config', 'json']
      return ext => text.some(i => i === ext)
    },
    viewer () {
      const url = this.attachmentDetails.url
      if (url) {
        const ext = url.split('.').pop().toLowerCase()
        switch (true) {
          case ext === 'pdf':
            return 'pdf-viewer'
          case this.isText(ext):
            return 'txt-viewer'
          case this.isImage(ext):
            return 'img-viewer'
          default:
            return 'not-support'
        }
      }
      return null
    }
  },
  watch: {
    attachments () {
      this.getAttachmentDetails()
    },
    activeAttachment (newAt, oldAt) {
      newAt.id === oldAt.id || this.getAttachmentDetails()
    }
  },
  created () {
    this.getAttachmentDetails()
  }
}
</script>
