<template>
  <font-awesome-icon :icon="fileIcon(extention)" size="lg"/>
</template>

<script>
import {
  faFileExcel as xls,
  faFileImage as img,
  faFilePdf as pdf,
  faFilePowerpoint as ppt,
  faFileWord as doc,
  faFileAlt as txt
} from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
library.add(xls, img, pdf, ppt, doc, txt)
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
export default {
  components: {
    FontAwesomeIcon
  },
  props: {
    extention: String
  },
  data: () => ({
    image: ['png', 'jpeg', 'jpg', 'bmp'],
    text: ['txt', 'log'],
    word: ['doc', 'docx', 'rtf'],
    excel: ['xls', 'xlsx'],
    powPoint: ['ppt', 'pptx']
  }),
  computed: {
    isImage() {
      return ext => this.image.some(i => i === ext)
    },
    isText() {
      return ext => this.text.some(i => i === ext)
    },
    isWord() {
      return ext => this.word.some(i => i === ext)
    },
    isExcel() {
      return ext => this.excel.some(i => i === ext)
    },
    isPowPoint() {
      return ext => this.powPoint.some(i => i === ext)
    },
    fileIcon() {
      return ext => {
        switch (true) {
          case ext === 'pdf': return 'file-pdf'
          case this.isImage(ext): return 'file-image'
          case this.isText(ext): return 'file-alt'
          case this.isExcel(ext): return 'file-excel'
          case this.isWord(ext): return 'file-word'
          case this.isPowPoint(ext): return 'file-powerpoint'
        }
      }
    },
  }
}
</script>

<style scoped>

</style>
