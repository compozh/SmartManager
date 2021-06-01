<template>
  <ejs-documenteditorcontainer
    id='container'
    ref="doceditcontainer"
    :serviceUrl='serviceUrl'
    height="100%"
    style='flex: 1 1 0;'
    :enableToolbar='true'
    :toolbarItems='items'
    :locale="$i18n.locale"
    :showPropertiesPane="false"
    :currentUser="userName"
    :restrictEditing="!access.editFile"
    :toolbarClick="saveVersion"
    :contentChange="enableSaveBtn"/>
</template>

<script>
import Vue from 'vue'
import { DocumentEditorContainerPlugin, Toolbar } from '@syncfusion/ej2-vue-documenteditor'
import { userInfo } from '@/mixins/users'
import { attachments } from '@/mixins/units'
import viewersMixin from '@/mixins/viewers'

Vue.use(DocumentEditorContainerPlugin)

export default {
  name: 'documenteditorcontainer',
  mixins: [userInfo, viewersMixin, attachments],
  props: {
    url: String
  },
  provide: {
    DocumentEditorContainer: [Toolbar]
  },
  data: () => ({
    loading: false,
    documentChanged: false,
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
    serviceUrl: window.appConfig.GqlUrl + 'api/documenteditor/',
    exportUrl: window.appConfig.GqlUrl + 'upload'
  }),
  computed: {
    access () {
      return this.activeAttachment.access
    },
    editor () {
      return this.$refs.doceditcontainer.ej2Instances.documentEditor
    },
    toolbar () {
      return this.$refs.doceditcontainer.ej2Instances.toolbar
    },
    saveButton () {
      return {
        tooltipText: 'Save this document',
        id: 'save',
        text: `<div class="d-flex flex-column">
                 <i class="fas fa-save"
                    style="font-size: 14px;
                           color: #737373;
                           margin: 9px 0 4px;"></i>
               ${this.$t('buttons.save')}</div>`
      }
    }
  },
  watch: {
    url (url) {
      if (url && !this.loading) {
        this.loadDocument()
      }
    }
  },
  created () {
    this.items.unshift(this.saveButton)
  },
  mounted () {
    this.loadDocument()
  },
  methods: {
    loadDocument () {
      this.loading = true
      this.disableSaveBtn()
      this.openData()
      this.editorSettings()
      this.setAccess()
      this.loading = false
    },
    async saveVersion (args) {
      if (args.item.id === 'save') {
        this.disableSaveBtn()
        const result = await this.exportBlob()
        await this.addVersion(this.activeAttachment, result.fileName)
      }
    },
    async openData () {
      const data = await this.importData()
      this.editor.open(data)
    },
    async importData () {
      const data = { fileUrl: this.url }
      this.$store.commit('START_PRELOADER', 'importData')
      try {
        const response = await fetch(this.serviceUrl + 'importFromUrl', {
          method: 'POST',
          body: JSON.stringify(data),
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          }
        })
        return await response.json()
      } catch (e) {
        console.error(e.request ? e.request.statusText : e.message)
        this.$store.commit('SET_NOTIFY', {
          text: this.$t('notify.attachOpenFail'),
          color: 'warning'
        })
      } finally {
        this.$store.commit('STOP_PRELOADER', 'importData')
      }
    },
    async exportBlob () {
      const exportedDocument = await this.editor.saveAsBlob('Docx')
      const formData = new FormData()
      formData.append('file', exportedDocument, this.activeAttachment.fileName)
      return await this.uploadData(formData)
    },
    async uploadData (formData) {
      this.$store.commit('START_PRELOADER', 'uploadData')
      try {
        const response = await fetch(this.exportUrl, {
          method: 'POST',
          body: formData,
          credentials: 'include',
          headers: {
            'Upload-Type': 'single'
          }
        })
        return await response.json()
      } catch (e) {
        console.error('Upload fail', e)
      } finally {
        this.$store.commit('STOP_PRELOADER', 'uploadData')
      }
    },
    editorSettings () {
      this.editor.fitPage('FitPageWidth')
    },
    setAccess () {
      if (!this.access.editFile) {
        this.items = ['Comments', 'Separator', 'Find']
        this.toolbar.propertiesPaneButton.disabled = true
        this.toolbar.propertiesPaneButton.element.style.display = 'none'
      }
    },
    disableSaveBtn () {
      this.toolbar.enableItems(0, false)
    },
    enableSaveBtn () {
      this.toolbar.enableItems(0, true)
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
