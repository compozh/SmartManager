<template>
  <div id="mainContainer" class="app-fixed-height flex flex-wrap">
    <div class="flex w-1/2 h-full bg-white p-2 pr-0">
      <VuePerfectScrollbar class="scroll-area" :settings="settings">
        <table>
          <tr>
            <th>{{ $t('table.sign') }}</th>
            <th>{{ $t('table.name') }}</th>
            <th>{{ $t('table.size') }}</th>
            <th>{{ $t('table.kind') }}</th>
          </tr>
          <tr v-for="(attachment, index) in originals" :key="index"
              :class="{active: attachment.id === +$route.params.attachmentId}"
              @click="toAttachment(attachment.id)">
            <td>+</td>
            <td class="text-left">{{ attachment.fileName }}</td>
            <td>{{ fileSize(attachment.fileSize) }}</td>
            <td>{{ attachment.fileExt }}</td>
          </tr>
        </table>
      </VuePerfectScrollbar>
    </div>
    <div class="flex w-1/2 h-full bg-white justify-center">
      <component :is="viewer" :url="fileUrl"></component>
    </div>
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
    index: 0,
    fileId: 0,
    fileUrl: '',
    types: [],
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
      return 'no-data'
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
    toAttachment(id) {
      if (id) {
        this.$router.push({name: 'task-attachment', params: {attachmentId: id}})
        const attachment = this.originals.find(o => o.id === id) || {}
        this.getUrl(attachment)
        this.getAttachmentTypes()
      }
    },
    async getUrl({id: fileId, fileExt, fileUrl}) {
      const id = this.$route.params.taskId || this.$route.params.caseId
      this.fileId = fileId
      this.fileUrl = fileUrl || await this.$store.dispatch('sm/getFileUrl', {fileId, fileExt, id})
    },
    async getAttachmentTypes() {
      const params = {
        type: this.type,
        id: this.task.id || this.$route.params.taskId,
        arso: this.task.arso,
        keyValue: this.task.keyValue,
        kidCopy: this.task.kidCopy
      }
      this.types = await this.$store.dispatch('sm/getAttachmentTypes', params)
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

  tr {

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
  }

  td {
    border: 1px solid rgba(21,27,38,.15);
    padding: 5px;
    text-align: center;
  }

</style>
