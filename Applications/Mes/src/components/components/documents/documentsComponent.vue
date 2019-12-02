<template>
  <div class="mes-documents-component">
    <v-layout column class="mes-documents-component-layout">
      <v-flex class="documents-list-blocks">
        <mes-content-loader
          v-if="!initializeDocuments && !documents.length"
          :loaderType=loaderType
        />
        <v-text-field
          v-if="initializeDocuments"
          class="search-field"
          label="Поиск документов"
          v-model="documentSearchValue"
          @keydown.enter="documentSearchSubmit"
          @click:clear="documentClearSearch"
          clearable
        ></v-text-field>
        <div class="documents-list-block-content" @scroll.passive="onScroll">
          <mes-document-cards
          @changeCurrentDocument=changeCurrentDocument
          :initializeDocuments=initializeDocuments
          />
          <span v-if="isUploadInProcess" class='upload-documents-str'>Загрузка документов</span>
        </div>
        <span v-if="initializeDocuments && !documents.length" class="lack-of-documents-str">Документы отсутствуют</span>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
export default {
  name: 'mes-documents-component',
  data() {
    return {
      loaderType: 'list',
    }
  },
  props: {
    isUploadInProcess: Boolean,
    initializeDocuments: Boolean
  },
  computed: {
    documents() {
      return this.$store.getters['mes/documents']
    },
    documentSearchValue: {
      get() {
        return this.$store.getters['mes/documentSearchValue']
      },
      set(documentSearchValue) {
        this.$store.commit('mes/setDocumentSearchValue', documentSearchValue)
      }
    }
  },
  methods: {
    documentSearchSubmit(e){
      this.$emit('initialize')
    },
    documentClearSearch() {
      this.$store.commit('mes/setDocumentSearchValue', '')
      this.$emit('initialize')
    },
    changeCurrentDocument(newDocument) {
      this.$emit('changeCurrentDocument', newDocument)
    },
    onScroll(e) {
      const me = this
      let blockHeight = e.target.scrollHeight
      let blockTop = e.target.scrollTop + 100
      let clientHeight = e.target.clientHeight
      if (!me.isUploadInProcess && blockHeight - blockTop >= clientHeight - 20 && blockHeight - blockTop <= clientHeight + 20) {
        let lastDocumentDate = me.documents[me.documents.length - 1].timeStamp
        me.$emit('uploadDocumentsOnScroll', lastDocumentDate)
      }
    }
  }
}
</script>

<style type="text/css" scoped>
.mes-documents-component {
    height: 100%;
    width: 30%;
    min-width: 330px
  }
  .mes-documents-component-layout {
    height: 100%;
  }

  .documents-list-block-content {
    height:100%;
    overflow-y: auto;
    position: absolute;
    width: 100%;
  }

  .documents-list-block-content::-webkit-scrollbar {
    background-color:#fff;
    width:16px
  }
  .v-card__text.active-task-item {
    border-top-left-radius: none !important;
    border-top-right-radius: none !important;
  }
  /* background of the scrollbar except button or resizer */
  .documents-list-block-content::-webkit-scrollbar-track {
    background-color:#fff
  }
  .documents-list-block-content::-webkit-scrollbar-track:hover {
    background-color:#f4f4f4
  }

  /* scrollbar itself */
  .documents-list-block-content::-webkit-scrollbar-thumb {
    background-color:#babac0;
    border-radius:16px;
    border:5px solid #fff
  }
  .documents-list-block-content::-webkit-scrollbar-thumb:hover {
    background-color:#a0a0a5;
    border:4px solid #f4f4f4
  }
  /* set button(top and bottom of the scrollbar) */
  .documents-list-block-content::-webkit-scrollbar-button {display:none}

  .upload-documents-str {
    display: flex;
    justify-content: center;
    text-transform: uppercase;
    font-size: 13px;
    color: #326da8;
    font-weight: 400;
  }

  .lack-of-documents-str {
    font-size: 2em;
    font-weight: 500;
    color: #3d83f7;
    opacity: 0.5;
    padding-left: 10px;
  }
  .search-documents-field {
    height: 46px;
  }
  .search-documents-field .v-label {
    left: 5px !important;
  }
</style>
