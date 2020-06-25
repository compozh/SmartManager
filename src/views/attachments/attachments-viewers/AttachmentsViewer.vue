<template>
  <div class="fill-height">
    <component v-if="viewer" :is="viewer" :url="attachmentDetails.url"/>

    <no-data v-else-if="loading" class="fill-height flex-wrap">
      <div class="headline font-weight-light grey--text d-flex flex-column align-center">
        {{ 'Подготовка вложения...' /* TODO: add resource */ }}
        <div class="lds-default mt-10">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </no-data>

    <no-data v-else class="fill-height">
        <span v-if="attachmentDetails.reason"
              class="headline font-weight-light grey--text">
          {{ attachmentDetails.reason }}
        </span>
    </no-data>
  </div>
</template>

<script>
import EjsPdfViewer from './viewers/ejs-pdf-viewer'

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
    NoData,
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
      const url = this.attachmentDetails.url
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

<style scoped>

  .lds-default {
    display: inline-block;
    position: relative;
    width: 80px;
    height: 80px;
  }

  .lds-default div {
    position: absolute;
    width: 6px;
    height: 6px;
    background: #9f9f9f;
    border-radius: 50%;
    animation: lds-default 1.2s linear infinite;
  }

  .lds-default div:nth-child(1) {
    animation-delay: 0s;
    top: 37px;
    left: 66px;
  }

  .lds-default div:nth-child(2) {
    animation-delay: -0.1s;
    top: 22px;
    left: 62px;
  }

  .lds-default div:nth-child(3) {
    animation-delay: -0.2s;
    top: 11px;
    left: 52px;
  }

  .lds-default div:nth-child(4) {
    animation-delay: -0.3s;
    top: 7px;
    left: 37px;
  }

  .lds-default div:nth-child(5) {
    animation-delay: -0.4s;
    top: 11px;
    left: 22px;
  }

  .lds-default div:nth-child(6) {
    animation-delay: -0.5s;
    top: 22px;
    left: 11px;
  }

  .lds-default div:nth-child(7) {
    animation-delay: -0.6s;
    top: 37px;
    left: 7px;
  }

  .lds-default div:nth-child(8) {
    animation-delay: -0.7s;
    top: 52px;
    left: 11px;
  }

  .lds-default div:nth-child(9) {
    animation-delay: -0.8s;
    top: 62px;
    left: 22px;
  }

  .lds-default div:nth-child(10) {
    animation-delay: -0.9s;
    top: 66px;
    left: 37px;
  }

  .lds-default div:nth-child(11) {
    animation-delay: -1s;
    top: 62px;
    left: 52px;
  }

  .lds-default div:nth-child(12) {
    animation-delay: -1.1s;
    top: 52px;
    left: 62px;
  }

  @keyframes lds-default {
    0%, 20%, 80%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.5);
    }
  }

</style>
