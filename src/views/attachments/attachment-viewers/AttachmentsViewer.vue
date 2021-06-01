<template>
  <div class="d-flex flex-column fill-height">
    <component v-if="viewer"
               :is="viewer"
               :url="url"/>

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
import { tasks, attachments } from '@/mixins/units'

const PdfViewer = () => import('./viewers/PdfViewer')
const SpreadsheetViewer = () => import('./viewers/SpreadsheetViewer')
const DocumentEditor = () => import('./viewers/DocumentEditor')
const ImgViewer = () => import('./viewers/ImageViewer')
const TxtViewer = () => import('./viewers/TextViewer')
const NotSupport = () => import('./NotSupport')
const AttachmentPreLoader = () => import('./AttachmentPreLoader')
const NoData = () => import('./NoData')

export default {
  name: 'AttachmentsViewer',
  props: ['showOriginal'],
  components: {
    PdfViewer,
    SpreadsheetViewer,
    DocumentEditor,
    ImgViewer,
    TxtViewer,
    NotSupport,
    NoData,
    AttachmentPreLoader
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
    isExcel () {
      const text = ['xls', 'xlsx', 'csv']
      return ext => text.some(i => i === ext)
    },
    isWord () {
      const text = ['doc', 'docx', 'rtf']
      return ext => text.some(i => i === ext)
    },
    viewer () {
      const url = this.url
      if (url) {
        const ext = url.split('.').pop().toLowerCase()
        switch (true) {
          case ext === 'pdf': return 'pdf-viewer'
          case this.isText(ext): return 'txt-viewer'
          case this.isImage(ext): return 'img-viewer'
          case this.isExcel(ext): return 'spreadsheet-viewer'
          case this.isWord(ext): return 'document-editor'
          default: return 'not-support'
        }
      }
      return null
    },
    url () {
      if (this.currentVersion.Details) {
        return this.showOriginal
          ? this.currentVersion.Details.FileUrl
          : this.currentVersion.Details.Pdf
      }
      return ''
    }
  }
}
</script>
