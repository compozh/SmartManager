<template>
  <v-container pa-0>
    <v-layout column>
      <v-flex class="toolbar">
        <a v-show="false" v-for="i in pdfPages" :href="'#' + i">{{ i }} </a>
        <v-btn depressed small @click="width-=10">-</v-btn>
        {{ width }} %
        <v-btn depressed small @click="width+=10"> +</v-btn>
        <v-btn depressed small @click="rotate += 90">&#x27F3;</v-btn>
        <v-btn depressed small @click="rotate -= 90">&#x27F2;</v-btn>
      </v-flex>
      <v-flex class="viewer-container">
        <v-layout ma-3 column>
          <v-flex
            class="pdf-viewer"
            v-if="fileType === 'pdf'"
          >
            <v-layout column>
              <v-flex
                my-2
                elevation-3
                v-for="i in pdfPages"
              >
                <pdf
                  :id="i"
                  :src="fileUrl"
                  :page="i"
                  :rotate="rotate" :style="{ width: width + '%'}"
                ></pdf>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex
            v-else-if="fileType === 'txt'"
            class="text-viewer pa-4"
            v-model="sourceText"
          >{{ sourceText }}
          </v-flex>
          <v-flex
            v-else-if="fileType === 'img'"
            class="image-viewer"
          >
            <v-img :src="fileUrl"></v-img>
          </v-flex>
          <v-flex v-else>
            <v-layout
              row wrap
              align-content-center
            >
              <v-flex xs12>
                <v-icon
                  color="grey lighten-2"
                  size="200"
                >error_outline
                </v-icon>
              </v-flex>
              <v-flex xs12 class="file-title">
                <span
                  class="headline grey--text text--lighten-2"
                >ФАЙЛЫ <b>{{ getFileExtension.toUpperCase() }}</b> НЕ ПОДДЕРЖИВАЮТСЯ
                </span>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import pdf from 'vue-pdf'
  import axios from 'axios'

  const imageTypes = ['bzg', 'png', 'jpg']

  export default {
    name: "documentViewer",
    props: ['fileUrl', 'fileName'],
    components: {
      pdf
    },
    data: () => ({
      page: 1,
      pdfPages: 0,
      rotate: 0,
      currentPage: 0,
      pageCount: 0,
      sourceText: '',
      width: 100
    }),
    computed: {
      // Определение формата файла
      getFileExtension() {
        return this.fileName.split('.').pop()
      },
      fileType() {
        if (!this.fileName || !this.fileUrl) {
          return
        }
        const fileExtension = this.getFileExtension
        const fileType = imageTypes
          .some(i => i === fileExtension)
          ? 'img'
          : fileExtension

        switch (fileType) {
          case 'txt':
            this.setTextFromFile()
            break
          case 'pdf':
            pdf.createLoadingTask(this.fileUrl)
              .then(pdf => this.pdfPages = pdf.numPages)
            break
          case 'img':
            break;
        }
        return fileType
      }
    },
    methods: {
      // Получение текста из файла с форматом txt
      setTextFromFile() {
        axios.get(this.fileUrl)
          .then(res => this.sourceText = res.data)
      }
    }
  }
</script>

<style scoped>

  .viewer-container {
    box-shadow: 0 0 0 1px rgba(100, 121, 143, 0.122);
    height: 85vh;
    overflow: auto;
  }

  .text-viewer {
    text-align: justify;
    line-height: 2;
  }

  .image-viewer {
    max-width: 100%;
  }
</style>