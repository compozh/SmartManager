<template>
  <ejs-pdfviewer id="pdfViewer"
                 ref="pdfviewer"
                 class="flex-grow-1"
                 :serviceUrl="serviceUrl"
                 :documentPath="url"
                 :locale="$i18n.locale"
                 :documentLoad="documentLoad"/>
</template>

<script>
import Vue from 'vue'
import {
  PdfViewerPlugin,
  Toolbar,
  Magnification,
  Navigation,
  LinkAnnotation,
  BookmarkView,
  ThumbnailView,
  Print,
  TextSelection,
  TextSearch,
  Annotation,
  FormFields
} from '@syncfusion/ej2-vue-pdfviewer'
import viewersMixin from '@/mixins/viewers'

Vue.use(PdfViewerPlugin)

export default {
  name: 'PdfViewer',
  mixins: [viewersMixin],
  props: {
    url: String
  },
  data: () => ({
    localization: 'pdfViewer',
    serviceUrl: window.appConfig.GqlUrl + 'api/pdfviewer'
  }),
  provide: {
    PdfViewer: [Toolbar, Magnification, Navigation, LinkAnnotation, BookmarkView, ThumbnailView, Print, TextSelection, TextSearch, Annotation, FormFields]
  },
  methods: {
    documentLoad () {
      const viewer = this.$refs.pdfviewer.ej2Instances
      viewer.toolbar.showToolbarItem(['OpenOption', 'DownloadOption', 'SubmitForm'], false)
    }
  }
}

</script>

<style scoped>

  @import '~@syncfusion/ej2-base/styles/material.css';
  @import '~@syncfusion/ej2-buttons/styles/material.css';
  @import '~@syncfusion/ej2-dropdowns/styles/material.css';
  @import '~@syncfusion/ej2-inputs/styles/material.css';
  @import '~@syncfusion/ej2-navigations/styles/material.css';
  @import '~@syncfusion/ej2-popups/styles/material.css';
  @import '~@syncfusion/ej2-splitbuttons/styles/material.css';
  @import "~@syncfusion/ej2-vue-pdfviewer/styles/material.css";

</style>
