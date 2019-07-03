<template>
  <v-layout column class="pdf-viewer">
    <v-flex blue-grey lighten-4>
      <v-btn outline small class="viewer-btn" @click="rotate += 90">&#x27F3;</v-btn>
      <v-btn outline small class="viewer-btn" @click="width-=10">-</v-btn>
      {{ width }} %
      <v-btn outline small class="viewer-btn" @click="width+=10"> +</v-btn>
      <v-btn outline small class="viewer-btn" @click="rotate -= 90">&#x27F2;</v-btn>
    </v-flex>
    <v-flex class="viewer-container">
      <v-layout column>
        <v-flex v-for="i in pages">
          <pdf
            :id="i"
            :src="url"
            :page="i"
            :rotate="rotate" :style="{ width: width + '%'}"
          ></pdf>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>

  import pdf from 'vue-pdf'

  export default {
    name: "sm-pdf-viewer",
    props: ['url'],
    components: {
      pdf
    },
    data: () => ({
      page: 1,
      pages: 0,
      rotate: 0,
      curPage: 0,
      pageCount: 0,
      sourceText: '',
      width: 100
    }),
    created() {
      if (this.url) {
      }
      pdf.createLoadingTask(this.url)
        .then(pdf => this.pages = pdf.numPages)
        .catch(e => this.$store.commit('sm/setError', e.message))
    }
  }
</script>

<style scoped>

  .pdf-viewer, .viewer-container {
    height: inherit;
  }

  .viewer-container {
    overflow: auto;
  }

  .v-btn.viewer-btn {
    padding: 0;
    text-transform: none;
    font-weight: 300;
    color: #666;
    background-color: #f5f5f5 !important;
    border-color: #c6c6c6;
    height: 20px;
    min-width: 30px;
  }

  ::-webkit-scrollbar {
    display: none;
  }

</style>