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
    <div>
      <vs-popup title="Електронно цифрові підписи до вкладення - _U0T4L1ZBL, версія 3"
                :active.sync="edsPopup">
        <vs-table stripe :data="edsItems">
          <template slot="thead">
            <vs-th active>
              Статус
            </vs-th>
            <vs-th>
              Дата
            </vs-th>
            <vs-th>
              Підписант
            </vs-th>
            <vs-th>
              Організація
            </vs-th>
            <vs-th>
              Посада
            </vs-th>
            <vs-th>
              ЄДРПОУ
            </vs-th>
            <vs-th>
              ЦСК
            </vs-th>
            <vs-th>
              Коментар
            </vs-th>
            <vs-th>
              Дії
            </vs-th>
          </template>
          <template slot-scope="{data}">
            <vs-tr class="truncate" :key="indextr" v-for="(tr, indextr) in data">

              <vs-td>
                <feather-icon icon="UserCheckIcon"></feather-icon>
              </vs-td>

              <vs-td :data="data[indextr].date">
                {{data[indextr].date}}
              </vs-td>

              <vs-td :data="data[indextr].signatory">
                {{data[indextr].signatory}}
              </vs-td>

              <vs-td :data="data[indextr].organization">
                {{data[indextr].organization}}
              </vs-td>

              <vs-td :data="data[indextr].position">
                {{data[indextr].position}}
              </vs-td>

              <vs-td></vs-td>

              <vs-td :data="data[indextr].keyCenter">
                {{data[indextr].keyCenter}}
              </vs-td>

              <vs-td></vs-td>

              <vs-td class="flex">
                <vs-button color="primary" size="small" type="flat" icon="touch_app"/>
                <vs-button color="success" size="small" type="flat" icon="check_circle"/>
                <vs-button color="warning" size="small" type="flat" icon="vpn_key"/>
                <vs-button color="danger" size="small" type="flat" icon="delete"/>
              </vs-td>

            </vs-tr>
          </template>
        </vs-table>
      </vs-popup>
    </div>
  </div>
</template>
<script>
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import AttachmentList from './AttachmentList'
import NotSupport from '@/components/NotSupport'
import NoData from '@/components/NoData'

const PdfViewer = () => import('@/components/pdf-viewer/Viewer')
const ImgViewer = () => import('@/components/ImageViewer')
const TxtViewer = () => import('@/components/TextViewer')

export default {
  components: {
    AttachmentList,
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
    edsItems: [
      {
        status: 'Ok',
        date: '10.01.2020 12:10',
        signatory: 'Евгений Мелентьев',
        organization: 'IT-Enterprise',
        position: 'Фізична особа',
        keyCenter: 'Тестовий ЦСК АТ "ІІТ"',
      },
      {
        status: 'Ok',
        date: '10.01.2020 12:10',
        signatory: 'Виталий Бахарев',
        organization: 'IT-Enterprise',
        position: 'Фізична особа',
        keyCenter: 'Тестовий ЦСК АТ "ІІТ"',
      },
      {
        status: 'Ok',
        date: '10.01.2020 12:10',
        signatory: 'Игорь Певчев',
        organization: 'IT-Enterprise',
        position: 'Фізична особа',
        keyCenter: 'Тестовий ЦСК АТ "ІІТ"',
      },
      {
        status: 'Ok',
        date: '10.01.2020 12:10',
        signatory: 'Евгений Мелентьев',
        organization: 'IT-Enterprise',
        position: 'Фізична особа',
        keyCenter: 'Тестовий ЦСК АТ "ІІТ"',
      },
      {
        status: 'Ok',
        date: '10.01.2020 12:10',
        signatory: 'Виталий Бахарев',
        organization: 'IT-Enterprise',
        position: 'Фізична особа',
        keyCenter: 'Тестовий ЦСК АТ "ІІТ"',
      },
      {
        status: 'Ok',
        date: '10.01.2020 12:10',
        signatory: 'Игорь Певчев',
        organization: 'IT-Enterprise',
        position: 'Фізична особа',
        keyCenter: 'Тестовий ЦСК АТ "ІІТ"',
      }
    ],
    remarkItems: [
      {
        description: 'Граматичні помилки',
        resolve: false,
        date: '13.01.2020 15:16',
        who: 'Виталий Бахарев',
      },
      {
        description: 'Невірна структура',
        resolve: true,
        date: '15.01.2020 12:13',
        who: 'Игорь Певчев',
      },
      {
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aspernatur, quam?',
        resolve: false,
        date: '13.01.2020 15:16',
        who: 'Виталий Бахарев',
      },
      {
        description: 'Невірна структура',
        resolve: true,
        date: '15.01.2020 12:13',
        who: 'Игорь Певчев',
      }
    ],
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
    noDataMessage() {
      return this.$route.name === 'attach'
    },
    type() {
      if (this.task.__typename === 'Task') {
        return this.task.isGenerate ? 'DOCUMENT' : 'TASK'
      }
      if (this.task.__typename === 'Case') {
        return 'CASE'
      }
      return ''
    },
    edsPopup: {
      get() {
        return this.$store.state.sm.attachments.edsPopup
      },
      set(val) {
        this.$store.commit('sm/TOGGLE_EDS_POPUP', val)
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

</style>
