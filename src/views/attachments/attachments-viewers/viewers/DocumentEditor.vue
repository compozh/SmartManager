<template>
  <ejs-documenteditorcontainer id='container'
                               :serviceUrl='serviceUrl'
                               height="100%"
                               style='flex: 1 1 0;'
                               :enableToolbar='true'/>
</template>

<script>
import Vue from 'vue'
import { DocumentEditorContainerPlugin, Toolbar } from '@syncfusion/ej2-vue-documenteditor'

Vue.use(DocumentEditorContainerPlugin)
export default {
  data: () => ({
    serviceUrl: 'https://ej2services.syncfusion.com/production/web-services/api/documenteditor/'
  }),
  provide: {
    DocumentEditorContainer: [Toolbar]
  }
}
</script>

<style scoped>
  @import '~@syncfusion/ej2-base/styles/material.css';
  @import '~@syncfusion/ej2-buttons/styles/material.css';
  @import '~@syncfusion/ej2-inputs/styles/material.css';
  @import '~@syncfusion/ej2-popups/styles/material.css';
  @import '~@syncfusion/ej2-lists/styles/material.css';
  @import '~@syncfusion/ej2-navigations/styles/material.css';
  @import '~@syncfusion/ej2-splitbuttons/styles/material.css';
  @import '~@syncfusion/ej2-dropdowns/styles/material.css';
  @import "~@syncfusion/ej2-vue-documenteditor/styles/material.css";
</style>
