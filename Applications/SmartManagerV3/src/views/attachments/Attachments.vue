<template>
    <div class="fill-height">
      <component v-if=viewer :is="viewer" :url="fileUrl"/>
      <no-data v-else class="pa-8 title font-weight-light">{{ currentAttachment.reason }}</no-data>
    </div>
</template>

<script>
import NotSupport from '@/components/NotSupport'
import NoData from '@/components/NoData'
import { tasks } from '@/mixins/units'

const PdfViewer = () => import('@/components/pdf-viewer/Viewer')
const ImgViewer = () => import('@/components/ImageViewer')
const TxtViewer = () => import('@/components/TextViewer')

export default {
  mixins: [tasks],
  components: {
    PdfViewer,
    ImgViewer,
    TxtViewer,
    NotSupport,
    NoData
  },
  data: () => ({
    index: 0,
    fileId: 0,
    fileUrl: ''
  }),
  created () {
    // const attachmentId = this.$route.params.attachmentId
    // if (attachmentId) {
    //   this.fileId = attachmentId
    // } else {
    //   this.fileId = this.originals.length ? this.originals[0].id : 0
    // }
    const attachment = this.originals[1] || this.originals[0] || {}
    this.getDetails(attachment)
  },
  computed: {
    originals () {
      return this.task.originals && this.task.originals.length
        ? this.task.originals
        : []
    },
    isImage () {
      const image = ['png', 'jpeg', 'jpg', 'webp', 'bmp', 'gif']
      return ext => image.some(i => i === ext)
    },
    isText () {
      const text = ['txt', 'log', 'ini', 'dll', 'bat', 'config', 'json']
      return ext => text.some(i => i === ext)
    },
    viewer () {
      if (this.fileUrl) {
        const ext = this.fileUrl.split('.').pop().toLowerCase()
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
    },
    currentAttachment () {
      return this.$store.state.attachments.currentAttachment || {}
    }
  },
  methods: {
    toAttachment (id) {
      if (id) {
        this.$router.push({ name: 'task-attachment', params: { attachmentId: id } })
        const attachment = this.originals.find(o => o.id === id) || {}
        this.getDetails(attachment)
      }
    },
    async getDetails ({ id: fileId, fileExt }) {
      if (!fileId || !fileExt) {
        return
      }

      const id = +this.$route.params.taskId || +this.$route.params.caseId
      const fileDetails = await this.$store.dispatch('getFileDetails', { fileId, fileExt, id })
      this.fileId = fileId
      this.fileUrl = fileDetails.FileName ? fileDetails.FileUrl : null
    }
  }
}
</script>

<style scoped>

</style>
