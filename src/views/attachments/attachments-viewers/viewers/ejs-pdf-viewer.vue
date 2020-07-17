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
import { L10n } from '@syncfusion/ej2-base'

Vue.use(PdfViewerPlugin)

export default {
  props: {
    url: String
  },
  data: () => ({
    serviceUrl: window.appConfig.GrapgQlUrl + 'api/pdfviewer'
  }),
  provide: {
    PdfViewer: [Toolbar, Magnification, Navigation, LinkAnnotation, BookmarkView, ThumbnailView, Print, TextSelection, TextSearch, Annotation, FormFields]
  },
  computed: {
    locale () {
      return this.$i18n.locale
    }
  },
  watch: {
    locale (newLocale, oldLocale) {
      if (newLocale !== oldLocale) {
        this.setLocale()
      }
    }
  },
  created () {
    this.setLocale()
  },
  methods: {
    setLocale () {
      L10n.load({
        [this.locale]: {
          PdfViewer: this.$t('pdfViewer')
        }
      })
    },
    documentLoad () {
      const viewer = this.$refs.pdfviewer.ej2Instances
      viewer.toolbar.showToolbarItem(['OpenOption'], false)
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
