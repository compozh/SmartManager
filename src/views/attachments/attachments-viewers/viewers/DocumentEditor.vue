<template>
  <ejs-documenteditorcontainer id='container'
                               ref="doceditcontainer"
                               :serviceUrl='serviceUrl'
                               height="100%"
                               style='flex: 1 1 0;'
                               :enableToolbar='true'
                               :toolbarItems='items'
                               :locale="$i18n.locale"
                               :showPropertiesPane="false"
                               :currentUser="userName"
                               :restrictEditing="access.editFile"/>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import { DocumentEditorContainerPlugin, Toolbar } from '@syncfusion/ej2-vue-documenteditor'
import { userInfo } from '@/mixins/users'
import viewersMixin from '@/mixins/viewers'
Vue.use(DocumentEditorContainerPlugin)

export default {
  name: 'documenteditorcontainer',
  mixins: [userInfo, viewersMixin],
  props: {
    url: String,
    access: Object
  },
  provide: {
    DocumentEditorContainer: [Toolbar]
  },
  data: () => ({
    localization: 'documentEditor',
    items: [
      'Undo',
      'Redo',
      'Separator',
      'Image',
      'Table',
      'Hyperlink',
      'Comments',
      'Header',
      'Footer',
      'PageSetup',
      'PageNumber',
      'Separator',
      'Find',
      'Separator',
      'LocalClipboard',
      'RestrictEditing'
    ],
    serviceUrl: window.appConfig.GrapgQlUrl + 'api/documenteditor/'
  }),
  async mounted () {
    const data = { fileUrl: this.url }
    try {
      const result = await axios.post(this.serviceUrl + 'importFromUrl', data)
      const editor = this.$refs.doceditcontainer.ej2Instances.documentEditor
      editor.open(result.data)
      this.editorSettings(editor)
      this.setAccess(editor)
    } catch (e) {
      console.error(e.request ? e.request.statusText : e.message)
      this.$store.commit('SET_NOTIFY', {
        text: this.$t('notify.attachOpenFail'),
        color: 'warning'
      })
    }
  },
  methods: {
    editorSettings (editor) {
      editor.showOptionsPane = false
      editor.fitPage('FitPageWidth')
    },
    setAccess (editor) {
      if (!this.access.editFile) {
        this.items = ['Comments', 'Separator', 'Find']
        const toolbar = this.$refs.doceditcontainer.ej2Instances.toolbar
        toolbar.propertiesPaneButton.disabled = true
        toolbar.propertiesPaneButton.element.style.display = 'none'
      }
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
