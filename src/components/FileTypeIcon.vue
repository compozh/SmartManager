<template>
  <v-img src="@/assets/icons/file-icon.svg"
         contain :max-width="size"
         :style="{'font-size': size + 'px'}"
         class="d-flex align-center justify-center">
    <div class="extension text-truncate"
         :class="color(extension)"
         :style="{height: size/1.8 + 'px'}">
      <slot>{{ extension.toLowerCase() }}</slot>
    </div>
  </v-img>
</template>

<script>
export default {
  name: 'FileTypeIcon',
  props: {
    size: {
      type: [Number, String],
      default: () => 25
    },
    extension: {
      type: String,
      default: 'file'
    }
  },
  data: () => ({
    image: ['png', 'jpeg', 'jpg', 'bmp'],
    text: ['txt', 'log'],
    word: ['doc', 'docx', 'rtf'],
    excel: ['xls', 'xlsx'],
    powPoint: ['ppt', 'pptx']
  }),
  computed: {
    isImage () {
      return ext => this.image.some(i => i === ext)
    },
    isText () {
      return ext => this.text.some(i => i === ext)
    },
    isWord () {
      return ext => this.word.some(i => i === ext)
    },
    isExcel () {
      return ext => this.excel.some(i => i === ext)
    },
    isPowPoint () {
      return ext => this.powPoint.some(i => i === ext)
    },
    color () {
      return extension => {
        const ext = extension
          ? extension.toLowerCase()
          : 'file'
        switch (true) {
          case ext === 'pdf': return 'red'
          case this.isImage(ext): return 'warning'
          case this.isText(ext): return 'purple'
          case this.isExcel(ext): return 'green'
          case this.isWord(ext): return 'primary'
          case this.isPowPoint(ext): return 'brown'
          default: return 'grey'
        }
      }
    }
  }
}
</script>

<style scoped>

  .extension {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 3px;
    font-size: 0.45em;
    color: white;
  }

</style>
