<template>
<v-layout class="documents-layout">
  <v-flex class="documents-flex" v-if="initializeDynamicPage" :key="this.documentFormioKey">
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
    }
  },
  methods: {
    formSubmit(submission) {
      this.$store.dispatch('mes/documentFormIoSubmit', { formCode: this.pageProps.formCode, workCenter: this.workCenter, submission, document: this.selectedDocument, processType: this.pageProps.id })
    },
    getFormioData() {
      return this.$refs.formioBuilder[0].getFormSubmission()
    }
  }
}
</script>
<style type="text/css" scoped>
.documents-layout {
  width: 100%;
  height: 100%;
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
