<template>
  <div class="fill-height">
    <component v-if="viewer" :is="viewer" :url="url"/>

    <no-data v-else-if="activeAttachment.reason" class="fill-height">
        <span class="headline font-weight-light grey--text">
          {{ activeAttachment.reason }}
        </span>
    </no-data>

    <no-data v-else class="fill-height flex-wrap">
      <attachment-pre-loader/>
    </no-data>

  </div>
</template>

<script>
import EjsPdfViewer from './viewers/ejs-pdf-viewer'
import NotSupport from './NotSupport'
import AttachmentPreLoader from './AttachmentPreLoader'
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
    NoData,
    AttachmentPreLoader,
    EjsPdfViewer
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
      const url = this.url
      if (url) {
        const ext = url.split('.').pop().toLowerCase()
        switch (true) {
          // case ext === 'pdf':
          //   return 'ejs-pdf-viewer'
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
    },
    url () {
      return this.currentVersion.Details
        ? this.currentVersion.Details.FileUrl
        : ''
    }
  }
}
</script>
