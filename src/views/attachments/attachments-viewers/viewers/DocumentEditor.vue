<template>
  <ejs-documenteditorcontainer id='container'
                               ref="doceditcontainer"
                               :serviceUrl='serviceUrl'
                               height="100%"
                               style='flex: 1 1 0;'
                               :enableToolbar='true'
                               :toolbarItems='items'/>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import { DocumentEditorContainerPlugin, Toolbar } from '@syncfusion/ej2-vue-documenteditor'

Vue.use(DocumentEditorContainerPlugin)
export default {
  props: {
    url: String
  },
  provide: {
    DocumentEditorContainer: [Toolbar]
  },
  data: () => ({
    items: ['Undo', 'Redo', 'Separator', 'Image', 'Table', 'Hyperlink', 'Comments', 'Header', 'Footer', 'PageSetup', 'PageNumber', 'Separator', 'Find', 'Separator', 'LocalClipboard', 'RestrictEditing'],
    serviceUrl: window.appConfig.GrapgQlUrl + 'api/documenteditor/'
  }),
  async mounted () {
    const data = { fileUrl: this.url }
    try {
      const result = await axios.post(this.serviceUrl + 'importFromUrl', data)
      this.loadFile(result.data)
    } catch (e) {
      console.error(e.request ? e.request.statusText : e.message)
      this.$store.commit('SET_NOTIFY', {
        text: this.$t('notify.attachOpenFail'),
        color: 'warning'
      })
    }
  },
  methods: {
    loadFile (file) {
      const editor = this.$refs.doceditcontainer.ej2Instances.documentEditor
      editor.open(file)
    }
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
