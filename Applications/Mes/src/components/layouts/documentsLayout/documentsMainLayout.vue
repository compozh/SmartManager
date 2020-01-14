<template>
<v-layout class="documents-layout">
  <v-flex class="toolbar ma-0" v-if="$vuetify.breakpoint.smAndDown">
    <v-btn class="col-12 ma-0 close-btn" @click="changeDynamicTableView" text outlined>{{ $t('mes.buttons.Close') }}</v-btn>
  </v-flex>
  <v-flex class="documents-flex"  :class="$vuetify.breakpoint.smAndDown? 'small' : ''"  v-if="initializeDynamicPage" :key="this.documentFormioKey">
    <formio-component
      v-if="selectedDocument"
      ref="formioBuilder"
      @formSubmit=formSubmit
      :formDefinition=documentFormio
      :formCode=pageProps.formCode
    />
    </v-flex>
  </v-layout>
</template>

<script>

export default {
  name: 'mes-documents-main-layout',
  props: {
    initializeDynamicPage: Boolean,
    pageProps:Object
  },
  data() {
    return {
      documentFormioKey: 0
    }
  },
  computed: {
    selectedDocument() {
      return this.$store.getters['mes/selectedDocument']
    },
    properties() {
      return this.$store.getters['mes/properties']
    },
    workCenter() {
      return this.$store.getters['mes/workCenter']
    },
    documentFormio() {
      this.documentFormioKey += 1
      return this.$store.getters['mes/documentFormio']
    },
    dragResizeMode: {
      get() {
        return this.$store.getters['mes/dragResizeMode']
      },
      set() {
        this.$store.dispatch('mes/changeDragResizeMode')
      }
    },
  },
  methods: {
    async formSubmit({ submission, completeSubmissionCallback }) {
      var me = this,
        direction = 1,
        pageProps = me.pageProps,
        properties = {
          workCenterCode: me.workCenter.code,
          id: me.selectedDocument.id
        },
        searchDateTime = new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toJSON()

      me.$store.commit('mes/setDialogLinearLoaderMessage', this.$t('mes.dialogs.RegistrationDocument'))
      await me.$store.dispatch('formio/submitForm', { formCode: pageProps.formCode, submission, properties }).then(result => {
        if(result.success) {
          me.$store.commit('mes/setDocuments', [])
          me.$store.commit('mes/setInitializeDocuments', false)
          me.$store.dispatch('mes/downloadDocuments', { processTypeCode: pageProps.id, searchDateTime, direction })
        }
        completeSubmissionCallback(result)
      })
      me.$store.commit('mes/closeDialogLinearLoader')
    },
    getFormioData() {
      return this.$refs.formioBuilder[0].getFormSubmission()
    },
    changeDynamicTableView() {
      this.$emit('changeDynamicTableView', true)
    },
    changeDragResizeMode (mode) {
      this.dragResizeMode = mode
      var splitter = document.getElementsByClassName('gutter gutter-horizontal')[0]
      if (!this.dragResizeMode) {
        splitter.style.cssText = 'width:0'
      } else {
        splitter.style.cssText = 'width: 5px'
      }
    },
  },
  created() {
    if(this.$vuetify.breakpoint.smAndDown){
      this.changeDragResizeMode(false)
    }
  }
}
</script>
<style type="text/css" scoped>
.documents-layout {
  width: 100%;
  height: 100%;
}
.toolbar {
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: center;
  height: 63px;
  border-bottom: 1px solid rgba(2, 2, 2, 0.08);
}
.close-btn {
  min-width: 95% !important;
  height: 50px !important;
  border-radius: 5px;
  background-color:#fff;
  border: 1px solid rgba(2, 2, 2, 0.08);
}
.small {
    top: 60px;
}
.documents-flex {
    position: absolute;
    height: 100%;
    overflow-y: auto;
    width: 100%;
  }
  .documents-flex::-webkit-scrollbar {
    background-color:#fff;
    width:16px
  }
  .documents-flex::-webkit-scrollbar-track {
      background-color:#fff
  }
  .documents-flex::-webkit-scrollbar-track:hover {
      background-color:#f4f4f4
  }

  /* scrollbar itself */
 .documents-flex::-webkit-scrollbar-thumb {
      background-color:#babac0;
      border-radius:16px;
      border:5px solid #fff
  }
  .documents-flex::-webkit-scrollbar-thumb:hover {
      background-color:#a0a0a5;
      border:4px solid #f4f4f4
  }

  /* set button(top and bottom of the scrollbar) */
  .documents-flex::-webkit-scrollbar-button {display:none}
</style>
