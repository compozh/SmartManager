<template>
  <div>
    <div class="control-section">
      <ejs-pdfviewer id="pdfviewer"
                     :serviceUrl="serviceUrl"
                     :documentPath="documentPath"/>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { PdfViewerPlugin, Toolbar, Magnification, Navigation, LinkAnnotation, BookmarkView, ThumbnailView, Print, TextSelection, TextSearch, Annotation, FormFields } from '@syncfusion/ej2-vue-pdfviewer'

Vue.use(PdfViewerPlugin)

export default Vue.extend({
  props: {
    url: String
  },
  data: () => ({
    serviceUrl: 'https://ej2services.syncfusion.com/production/web-services/api/pdfviewer',
    documentPath: 'PDF_Succinctly.pdf'
  }),
  provide: {
    PdfViewer: [Toolbar, Magnification, Navigation, LinkAnnotation, BookmarkView, ThumbnailView, Print, TextSelection, TextSearch, Annotation, FormFields]
  }
})
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

  #pdfviewer {
    height: 820px;
  }

</style>
