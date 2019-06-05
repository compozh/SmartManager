<template>
  <v-container pa-0>
    <v-layout column>
      <v-flex class="toolbar py-1">
        DOCUMENT VIEWER TOOLBAR
      </v-flex>
      <v-flex>
        <v-layout column class="viewer-container">

          <v-flex
            v-if="whichFormat === 0"
            class="text"
            v-model="sourceText"
          >
          </v-flex>

          <v-flex ma-3 elevation-5
                  v-if="whichFormat === 1"
          >
            <pdf
              v-for="i in numPages"
              :key="i"
              :src="fileUrl"
              :page="i"
              style="display: inline-block; width:100%"
            >
            </pdf>
          </v-flex>

          <v-flex v-if="whichFormat === 2">
            <img
              :src="fileUrl"
              class="document-image"
            />
          </v-flex>

        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import pdf from 'vue-pdf'
  import axios from 'axios'
  // arrayImageFormat : коллекция форматов картинок
  const imageTypes = ['bzg', 'png', 'jpg']

  export default {
    name: "documentViewer",
    props: ['fileUrl', 'fileName'],
    components: {
      pdf
    },
    data: () => ({
      //Страницы в файле pdf
      numPages: null,
      sourceText: '',
    }),
    computed: {
      // Определение формата файла
      fileType() {
        return this.fileName.split('.').pop()
      },
      // 0 отображение текста в textarea,
      // 1 отображение pdf
      // 2 отображение картинок
      whichFormat() {
        console.log(this.fileName, this.fileUrl)
        if (!this.fileName || !this.fileUrl) {
          return
        }
        let whichFormat = -1
        let type = imageTypes.some(i => i === this.fileType)
          ? 'img'
          : this.fileType
        switch (type) {
          case 'txt':
            whichFormat = 0
            // Получение текста из текстового файла
            this.setTextFromFile()
            break
          case 'pdf':
            whichFormat = 1
            // Загрузка всех страниц
            let loadingTask = pdf.createLoadingTask(this.fileUrl)
            loadingTask
              .then(pdf => this.numPages = pdf.numPages)
            break
          case 'img':
            whichFormat = 2
            break;
        }
        return whichFormat
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
  .toolbar {
    box-shadow: inset 0 -1px 0 rgba(100, 121, 143, 0.122);
  }

  .viewer-container {
    height: 86vh;
    overflow: auto;
  }

  .text {
    width: 500px;
    height: 300px;
  }

  .document-image {
    max-width: 100%;
  }
</style>