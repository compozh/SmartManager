<template>
    <v-layout class="mes-dynamic-page" :key="documentKey">
      <vue-split
        class="main-dynamic-page-layout"
        :elements="this.pageProps.showListOnRightSide ? [
          '#dynamicPageDescription',
          '#dynamicPageList'
        ] : [
          '#dynamicPageList',
          '#dynamicPageDescription'
        ]"
        direction="horizontal"
        :min-size="0"
        :gutter-size="5"
        :snap-offset="100"
        :sizes="this.pageProps.hideList && !aspectRatioLayout ? [0,100] : aspectRatioLayout ? aspectRatioLayout : [25, 75]"
        @onDragEnd="changeAspectRatioLayout"
      >
        <mes-documents-main-layout
          v-if="this.pageProps.showListOnRightSide && !$vuetify.breakpoint.smAndDown"
          id="dynamicPageDescription"
          :initializeDocuments=initializeDocuments
          :pageProps=pageProps
        />
        <mes-documents-component
          ref="dynamicPageList"
          id="dynamicPageList"
          @changeCurrentDocument=changeCurrentDocument
          @uploadDocumentsOnScroll=uploadDocumentsOnScroll
          @initialize=initialize
          :isUploadInProcess=isUploadInProcess
          :initializeDocuments=initializeDocuments
          :pageProps=pageProps
          :currentDate=currentDate
          v-if="$vuetify.breakpoint.smAndDown? dynamicTableView : true"
          :class="$vuetify.breakpoint.smAndDown? 'dynamic-table-small' : ''"
          @changeDynamicTableView=changeDynamicTableView
        />
        <mes-documents-main-layout
          @changeDynamicTableView=changeDynamicTableView
          v-if="$vuetify.breakpoint.smAndDown? !dynamicTableView : !this.pageProps.showListOnRightSide "
          id="dynamicPageDescription"
          :initializeDocuments=initializeDocuments
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
      currentDate: new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toJSON(),
      isUploadInProcess: false,
      dynamicTableView: true
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
    mobilityProperties() {
      return this.$store.getters['mes/mobilityProperties']
    },
    documentKey(){
      return this.$store.getters['mes/documentKey']
    },
    initializeDocuments() {
      return this.$store.getters['mes/initializeDocuments']
    },
    selectedDocument: {
      get() {
        return this.$store.getters['mes/selectedDocument']
      },
      set(selectedDocument) {
        this.$store.commit('mes/setSelectedDocument', selectedDocument)
      }
    },
    aspectRatioLayout: {
      get() {
        let dynamicPagesCache = this.$store.getters['mes/dynamicPagesCache']
        return dynamicPagesCache && dynamicPagesCache[this.pageProps.id] ? dynamicPagesCache[this.pageProps.id] : false
      },
      set(aspectRatioLayout) {
        let dynamicPagesCache = this.$store.getters['mes/dynamicPagesCache']
        dynamicPagesCache[this.pageProps.id] = aspectRatioLayout
        this.$store.commit('mes/setDynamicPagesCache', dynamicPagesCache)
      }
    },
  },
  methods: {
    async initialize() {
      if (this.documents.length) {
        this.$store.commit('mes/setInitializeDocuments', false)
        this.$store.commit('mes/setDocuments', [])
      }
      var routeId = this.$route.params.id.toLowerCase()
      for (var j = 0; j < this.mobilityProperties.processesProperties.length; j++) {
        var page = this.mobilityProperties.processesProperties[j]
        if (page.id.toLowerCase() == routeId) {
          this.pageProps = page
         }
      }
      
      await this.$store.dispatch('mes/downloadDocuments', 
        { 
          processTypeCode: this.pageProps.id,
          searchDateTime: this.currentDate,
          query: this.documentSearchValue,
          direction: 1 
        }
      )
      this.selectFirstDocument()

      var formCode = this.pageProps.id,
        properties = {
          RCENTR: this.workCenter.code
        },
        fetchPolicy = 'network-only',
        deviceSizeType = this.$vuetify.breakpoint.name

      this.$store.dispatch('formio/getForm', { formCode, properties, fetchPolicy, deviceSizeType }).then(result => {
        if(result.success) {
          this.$store.commit('mes/setDocumentFormio', result)
        }
      })
    },
    changeCurrentDocument(newSelectedDocument) {
      if (this.selectedDocument == newSelectedDocument) {
        return
      }
      this.selectedDocument = newSelectedDocument
    },
    selectFirstDocument() {
      if (this.documents.length) {
        this.changeCurrentDocument(this.documents[0])
      }
    },
     changeAspectRatioLayout() {
      var listElementWidth =  this.$refs.dynamicPageList.$el.style.width
      var sizes = []
      listElementWidth = parseFloat(listElementWidth.replace('calc(', '').replace('% - 0px)', ''))
      var descriptionElementWidth = 100 - listElementWidth
      sizes.push(listElementWidth)
      sizes.push(descriptionElementWidth)
      this.aspectRatioLayout = this.pageProps.showListOnRightSide ? sizes.reverse() : sizes
    },
    async uploadDocumentsOnScroll(lastDocumentDate) {
      this.isUploadInProcess = true
      await this.$store.dispatch('mes/downloadDocuments', { processTypeCode: this.pageProps.id, searchDateTime: lastDocumentDate, query: this.documentSearchValue, direction: 1 })
      this.isUploadInProcess = false
    },
    changeDynamicTableView(mode) {
      this.dynamicTableView = mode
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
.dynamic-table-small {
    min-width: 100vw
}
</style>
