<template>
  <div id="mainContainer" class="app-fixed-height flex flex-wrap items-center rounded-lg">
    <attachment-list :originals="originals"
                     :toAttachment="toAttachment"
                     :fileSize="fileSize"/>
    <div class="flex lg:w-1/2 h-full justify-center rounded-r-lg
                border border-b-0 border-solid d-theme-border-grey-light">
      <component v-if=viewer class="rounded-r-lg" :is="viewer" :url="fileUrl"></component>
      <no-data v-else class="p-8">{{ currentAttachment.reason }}</no-data>
    </div>
    <attachment-eds></attachment-eds>
    <files-upload @attach="getAttachment($event)"
                  :uploadErrors="uploadErrors"
                  :fileList="false"
                  uploadAuto
                  id="file-upload"/>
  </div>
</template>
<script>
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import AttachmentList from './AttachmentList'
import AttachmentEds from './AttachmentEds'
import FilesUpload from '@/components/FilesUpload'
import NotSupport from '@/components/NotSupport'
import NoData from '@/components/NoData'

const PdfViewer = () => import('@/components/pdf-viewer/Viewer')
const ImgViewer = () => import('@/components/ImageViewer')
const TxtViewer = () => import('@/components/TextViewer')

export default {
  components: {
    AttachmentList,
    AttachmentEds,
    FilesUpload,
    PdfViewer,
    ImgViewer,
    TxtViewer,
    VuePerfectScrollbar,
    NotSupport,
    NoData
  },
  data: () => ({
    index: 0,
    fileId: 0,
    fileUrl: '',
    types: [],
    attachments: [],
    uploadErrors: [],
    settings: {
      maxScrollbarLength: 60,
      wheelSpeed: 0.50,
    }
  }),
  created() {
    const attachmentId = this.$route.params.attachmentId
    if (attachmentId) {
      this.fileId = attachmentId
    } else {
      this.fileId = this.originals.length ? this.originals[0].id : 0
    }
    this.toAttachment(this.fileId)
  },
  computed: {
    task() {
      const id = +this.$route.params.taskId
      const task = this.$store.state.sm.taskInfo[id]
      return task ? task : {}
    },
    originals() {
      return this.task.originals
             && this.task.originals.length
        ? this.task.originals
        : []
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
    fileSize() {
      return size => {
        switch (true) {
          case size < 1024: return `${size} Byte`
          case size < 1024000: return `${(size / 1024).toFixed(1)} Kb`
          default: return `${(size / 1024 / 1024).toFixed(2)} Mb`
        }
      }
    },
    currentAttachment() {
      return this.$store.state.sm.attachments.currentAttachment || {}
    },
    type() {
      if (this.task.__typename === 'Task') {
        return this.task.keyValue ? 'DOCUMENT' : 'TASK'
      }
      if (this.task.__typename === 'Case') {
        return 'CASE'
      }
      return ''
    },
    attachmentParams() {
      return {
        id: +this.$route.params.taskId || +this.$route.params.caseId,
        type: this.type,
        arso: this.task.arso,
        keyValue: this.task.keyValue,
        kidCopy: this.task.kidCopy
      }
    }
  },
  watch: {
    $route(to) {
      if (to.name === 'task-attachments') {
        this.fileUrl = ''
        // Clear  info about current attachment
        this.$store.commit('sm/SET_ATTACHMENT_DETAILS', {
          fileDetails: {
            ErrorMessage: this.$t('attachments.notSelected'),
          }
        })
      }
    }
  },
  methods: {
    uploadAdd() {
      this.$refs.upload.add()
    },
    toAttachment(id) {
      if (id) {
        this.$router.push({name: 'task-attachment', params: {attachmentId: id}})
        const attachment = this.originals.find(o => o.id === id) || {}
        this.getDetails(attachment)
        //this.getAttachmentTypes()
      }
    },
    async getDetails({id: fileId, fileExt}) {
      const id = +this.$route.params.taskId || +this.$route.params.caseId
      const fileDetails = await this.$store.dispatch('sm/getFileDetails', {fileId, fileExt, id})
      this.fileId = fileId
      this.fileUrl = fileDetails.FileName ? fileDetails.FileUrl : null
    },
    async getAttachmentTypes() {
      this.types = await this.$store.dispatch('sm/getAttachmentTypes', this.attachmentParams)
    },
    getAttachment(event) {
      this.attachments = event
      this.addAttachments()
    },
    async addAttachments() {
      const attachments = JSON.stringify(this.attachments)
      const params = this.attachmentParams
      // Returns results list
      const results = await this.$store.dispatch('sm/addAttachments', {attachments, params})
      results.forEach(result => {
        if (!result.success) {
          this.uploadErrors.push({
            fileName: result.name,
            message: result.errorMessage
          })
        }
      })
      this.attachments.length = 0
    }
  }
}
</script>

<style>
  #mainContainer {
    box-shadow: 0 1px 3px 0 rgba(21,27,38,.15);
  }

  #mainContainer > div.toolbar {
    margin: 0;
  }

  table {
    min-width: 99%;
    border-collapse: collapse;
  }

  tr:nth-child(2) > td {
    border-top: none;
  }

  tr:nth-child(odd) {
    background: rgba(21,27,38,.02);
  }

  tr:hover {
    background: rgba(21,27,38,.05);
    cursor: pointer;
  }

  tr.active {
    font-weight: bold;
    color: rgba(var(--vs-primary),1);
  }

  th {
    position: sticky;
    top: 0;
    background: white;
    padding: 10px 5px;
    text-align: center;
    box-shadow: 1px 1px 3px 0 rgba(21,27,38,.15);
  }

  td {
    border: 1px solid rgba(21,27,38,.15);
    padding: 5px;
    text-align: center;
  }

  .vs-component .vs-popup {
    width: auto;
    max-width: 80rem;
  }


  .vs-component .vs-popup td > span {
      display: flex;
      flex-wrap: nowrap;
  }

  #file-upload > span {
    display: none;
  }


</style>
