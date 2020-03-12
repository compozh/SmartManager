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
        <vue-pull-refresh :on-refresh="onRefresh">
          <div class="documents-list-block-content" @scroll.passive="onScroll">
            <mes-document-cards
            @changeCurrentDocument=changeCurrentDocument
            @changeDynamicTableView="showFloatBtn ? '' : changeDynamicTableView"
            :initializeDocuments=initializeDocuments
            :pageProps=pageProps
            />
            <span v-if="isUploadInProcess" class='upload-documents-str'>Загрузка документов</span>
          </div>
        </vue-pull-refresh>
        <span v-if="initializeDocuments && !documents.length" class="lack-of-documents-str">Документы отсутствуют</span>
      </v-flex>
      <v-btn v-if="showFloatBtn" fab 
        fixed bottom right color="rgb(185, 210, 250)" @click="changeDynamicTableView">
        <v-icon size="30">add</v-icon>
      </v-btn>
    </v-layout>
  </div>
</template>

<script>
import VuePullRefresh from 'vue-pull-refresh'
export default {
  name: 'mes-documents-component',
  data() {
    return {
      loaderType: 'list',
    }
  },
  components: {
    'vue-pull-refresh': VuePullRefresh
  },
  props: {
    isUploadInProcess: Boolean,
    initializeDocuments: Boolean,
    pageProps: Object
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
    },
    showFloatBtn() {
      return this.$vuetify.breakpoint.smAndDown && this.$route.params.id.toLowerCase() == 'defectcorrection'
    }
  },
  methods: {
    changeDynamicTableView() {
      this.$emit('changeDynamicTableView', false)
    },
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
    },
    onRefresh() {
      if(this.$vuetify.breakpoint.mdAndUp) {
        return
      }
      return new Promise( async (resolve, reject) => {
        let refreshIcon = document.querySelector('.pull-down-content--icon')
        refreshIcon.innerHTML = '<svg class="spinner" viewBox="0 0 64 64"><g stroke="black" stroke-width="6" stroke-linecap="round"><line y1="17" y2="29" transform="translate(32,32) rotate(180)"><animate attributeName="stroke-opacity" dur="750ms" values="1;.85;.7;.65;.55;.45;.35;.25;.15;.1;0;1" repeatCount="indefinite"></animate></line><line y1="17" y2="29" transform="translate(32,32) rotate(210)"><animate attributeName="stroke-opacity" dur="750ms" values="0;1;.85;.7;.65;.55;.45;.35;.25;.15;.1;0" repeatCount="indefinite"></animate></line><line y1="17" y2="29" transform="translate(32,32) rotate(240)"><animate attributeName="stroke-opacity" dur="750ms" values=".1;0;1;.85;.7;.65;.55;.45;.35;.25;.15;.1" repeatCount="indefinite"></animate></line><line y1="17" y2="29" transform="translate(32,32) rotate(270)"><animate attributeName="stroke-opacity" dur="750ms" values=".15;.1;0;1;.85;.7;.65;.55;.45;.35;.25;.15" repeatCount="indefinite"></animate></line><line y1="17" y2="29" transform="translate(32,32) rotate(300)"><animate attributeName="stroke-opacity" dur="750ms" values=".25;.15;.1;0;1;.85;.7;.65;.55;.45;.35;.25" repeatCount="indefinite"></animate></line><line y1="17" y2="29" transform="translate(32,32) rotate(330)"><animate attributeName="stroke-opacity" dur="750ms" values=".35;.25;.15;.1;0;1;.85;.7;.65;.55;.45;.35" repeatCount="indefinite"></animate></line><line y1="17" y2="29" transform="translate(32,32) rotate(0)"><animate attributeName="stroke-opacity" dur="750ms" values=".45;.35;.25;.15;.1;0;1;.85;.7;.65;.55;.45" repeatCount="indefinite"></animate></line><line y1="17" y2="29" transform="translate(32,32) rotate(30)"><animate attributeName="stroke-opacity" dur="750ms" values=".55;.45;.35;.25;.15;.1;0;1;.85;.7;.65;.55" repeatCount="indefinite"></animate></line><line y1="17" y2="29" transform="translate(32,32) rotate(60)"><animate attributeName="stroke-opacity" dur="750ms" values=".65;.55;.45;.35;.25;.15;.1;0;1;.85;.7;.65" repeatCount="indefinite"></animate></line><line y1="17" y2="29" transform="translate(32,32) rotate(90)"><animate attributeName="stroke-opacity" dur="750ms" values=".7;.65;.55;.45;.35;.25;.15;.1;0;1;.85;.7" repeatCount="indefinite"></animate></line><line y1="17" y2="29" transform="translate(32,32) rotate(120)"><animate attributeName="stroke-opacity" dur="750ms" values=".85;.7;.65;.55;.45;.35;.25;.15;.1;0;1;.85" repeatCount="indefinite"></animate></line><line y1="17" y2="29" transform="translate(32,32) rotate(150)"><animate attributeName="stroke-opacity" dur="750ms" values="1;.85;.7;.65;.55;.45;.35;.25;.15;.1;0;1" repeatCount="indefinite"></animate></line></g></svg>'
        refreshIcon.style = "background: none; height : 40px; width : 40px; -webkit-animation: none; margin-top: 0"
        this.$store.dispatch('mes/uploadDocuments',
          { processTypeCode: this.pageProps.id, searchDateTime: this.currentDate,
           query: this.documentSearchValue, direction: 1 })
        .then(()=>{
          resolve()
        })
      })
    },
  },
  mounted() {
    let refreshLabel = document.querySelector('.pull-down-content--label')
    let refreshHeader = document.querySelector('.pull-down-header')
    refreshHeader.style.display = this.$vuetify.breakpoint.smAndDown ? 'block' :  'none'
    refreshHeader.style.backgroundColor = "white"
    refreshLabel.innerText = ''
  }
}
</script>

<style type="text/css" scoped>
.mes-documents-component {
    height: 100%;
    width: 30%;
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
