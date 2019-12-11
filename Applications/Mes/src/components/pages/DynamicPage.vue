<template>
    <v-layout class="mes-dynamic-page">
      <vue-split
        class="main-dynamic-page-layout"
        :elements="[
          '#dynamicPageList',
          '#dynamicPageDescription'
        ]"
        direction="horizontal"
        :min-size="100"
        :gutter-size="5"
        :snap-offset="50"
        :sizes="this.defaultSizes"
      >
      <mes-documents-component
        id="dynamicPageList"
        @changeCurrentDocument=changeCurrentDocument
        @uploadDocumentsOnScroll=uploadDocumentsOnScroll
        @initialize=initialize
        :isUploadInProcess=isUploadInProcess
        :initializeDynamicPage=initializeDynamicPage
      />
      <mes-documents-main-layout
        id="dynamicPageDescription"
        :initializeDynamicPage=initializeDynamicPage
        :pageProps=pageProps
      />
      </vue-split>
    </v-layout>
</template>

<script>
import VueSplit from 'vue-splitjs'

export default {
  name: 'mes-dynamic-page',
  data() {
    return {
      pageProps: {},
      initializeDynamicPage: false,
      currentDate: new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toJSON(),
      defaultSizes: [25, 75],
      isUploadInProcess: false
    }
  },
  mounted() {
    if (this.initialWorkCenter && this.workCenter.accessPages == 'ONLY_INSTALLATION') {
      this.$router.replace({path: '/MES/installations'})
    }
  },
  created() {
    this.initialize()
  },
  components: { VueSplit },
  computed: {
    workCenter() {
      return this.$store.getters['mes/workCenter']
    },
    documents() {
      return this.$store.getters['mes/documents']
    },
    properties() {
      return this.$store.getters['mes/properties']
    },
    documentSearchValue() {
      return this.$store.getters['mes/documentSearchValue']
    },
    dynamicPage() {
      return this.$store.getters['mes/dynamicPages']
    },
    selectedDocument: {
      get() {
        return this.$store.getters['mes/selectedDocument']
      },
      set(selectedDocument) {
        this.$store.commit('mes/setSelectedDocument', selectedDocument)
      }
    },
  },
  methods: {
    async initialize() {
      if (this.documents.length) {
        this.initializeDynamicPage = false
        this.$store.commit('mes/setDocuments', [])
      }
      for (var j = 0; j < this.dynamicPage.properties.length; j++) {
        var page = this.dynamicPage.properties[j];
        var pageId = '_' + page.id
        if (pageId.toLowerCase() == this.$route.name.toLowerCase()) {
           this.pageProps = page
         }
      }
      await this.$store.dispatch('mes/downloadDocuments', { processTypeCode: this.pageProps.id, searchDateTime: this.currentDate, query: this.documentSearchValue, direction: 1 })
      this.initializeDynamicPage = true
      this.selectFirstDocument()
    },
    async changeCurrentDocument(newSelectedDocument) {
      var me = this
      if (me.selectedDocument == newSelectedDocument) {
        return
      }
      me.selectedDocument = newSelectedDocument
      me.$store.commit('mes/resetDocumentFormio')

      var properties = { workCenterCode: me.workCenter.code , id: newSelectedDocument.id }
      await me.$store.dispatch('formio/getForm', { formCode: me.pageProps.id, properties }).then(params => {
        if(params.success) {
          me.$store.commit('mes/setDocumentFormio', params)
        }

      })
    },
    selectFirstDocument() {
      if (this.documents.length) {
        this.changeCurrentDocument(this.documents[0])
      }
    },
    async uploadDocumentsOnScroll(lastDocumentDate) {
      this.isUploadInProcess = true
      await this.$store.dispatch('mes/downloadDocuments', { processTypeCode: this.pageProps.id, searchDateTime: lastDocumentDate, query: this.documentSearchValue, direction: 1 })
      this.isUploadInProcess = false
    }
  }
}
</script>

<style type="text/css" scoped>
.mes-dynamic-page {
  height: 100%;
}
.main-dynamic-page-layout {
  width: 100%;
}
</style>
