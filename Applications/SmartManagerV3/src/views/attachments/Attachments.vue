<template>
    <div class="fill-height">
      <component v-if=viewer :is="viewer" :url="attachmentDetails.url"/>
      <no-data v-else class="fill-height pa-2">
        <span v-if="attachmentDetails.reason">{{ attachmentDetails.reason }}</span>
      </no-data>
    </div>
</template>

<script>
import NotSupport from '@/components/NotSupport'
import NoData from '@/components/NoData'
import { tasks, attachments } from '@/mixins/units'

const PdfViewer = () => import('@/components/pdf-viewer/Viewer')
const ImgViewer = () => import('@/components/ImageViewer')
const TxtViewer = () => import('@/components/TextViewer')

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
