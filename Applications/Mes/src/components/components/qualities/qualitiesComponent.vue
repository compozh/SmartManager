<template>
  <div class="mes-qualities-component">
    <v-layout column class="mes-qualities-component-layout">
      <v-flex class="qualities-list-blocks">
        <mes-content-loader
          v-if="!initializeQualities && !qualities.length"
          :loaderType=loaderType
        />
        <v-text-field
          v-if="initializeQualities"
          class="search-field"
          :label="this.$t('mes.placeholders.SearchDocument')"
          v-model="documentSearchValue"
          @keydown.enter="documentSearchSubmit"
          @click:clear="documentClearSearch"
          clearable
        ></v-text-field>

        <vue-pull-refresh :on-refresh="onRefresh">
          <div class="qualities-list-block-content" @scroll.passive="onScroll">
            <mes-quality-cards
            @changeCurrentQuality=changeCurrentQuality
            :initializeQualities=initializeQualities
            @changeQualityTableView=changeQualityTableView
            />
            <span v-if="isUploadInProcess" class='upload-quality-str'>{{this.$t('mes.labels.DownloadDocuments')}}</span>
          </div>
        </vue-pull-refresh>
        <span v-if="initializeQualities && !qualities.length" class="lack-of-qualities-str">{{this.$t('mes.labels.NoDocuments')}}</span>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import VuePullRefresh from 'vue-pull-refresh'
export default {
  name: 'mes-quality-component',
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
    initializeQualities: Boolean,
    currentDate : String,
    properties : Object
  },
  computed: {
    qualities: {
      get() {
        return this.$store.getters['mes/qualities']
      },
      set(qualities) {
        this.$store.commit('mes/setQualities', qualities)
      }
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
    changeQualityTableView() {
      this.$emit('changeQualityTableView', false)
    },
    documentSearchSubmit(e){
      this.$emit('initialize')
    },
    documentClearSearch() {
      this.$store.commit('mes/setDocumentSearchValue', '')
      this.$emit('initialize')
    },
    changeCurrentQuality(newQuality) {
      this.$emit('changeCurrentQuality', newQuality)
    },
    onScroll(e) {
      const me = this
      let blockHeight = e.target.scrollHeight
      let blockTop = e.target.scrollTop + 100
      let clientHeight = e.target.clientHeight
      if (!me.isUploadInProcess && blockHeight - blockTop >= clientHeight - 20 && blockHeight - blockTop <= clientHeight + 20) {
        let lastQualityDate = me.qualities[me.qualities.length - 1].timeStamp
        me.$emit('uploadQualityOnScroll', lastQualityDate)
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

        this.$store.dispatch('mes/uploadQualities', { processTypeCode: this.properties.qualityProcessType,
         searchDateTime: this.currentDate, query: this.documentSearchValue, direction: 1 })
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
.mes-qualities-component {
    height: 100%;
    width: 30%;
    min-width: 330px
  }
  .mes-qualities-component-layout {
    height: 100%;
  }

  .qualities-list-block-content {
    height:calc(100% - 55px);
    overflow-y: auto;
    position: absolute;
    width: 100%;
  }

  .qualities-list-block-content::-webkit-scrollbar {
    background-color:#fff;
    width:16px
  }
  .v-card__text.active-task-item {
    border-top-left-radius: none !important;
    border-top-right-radius: none !important;
  }
  /* background of the scrollbar except button or resizer */
  .qualities-list-block-content::-webkit-scrollbar-track {
    background-color:#fff
  }
  .qualities-list-block-content::-webkit-scrollbar-track:hover {
    background-color:#f4f4f4
  }

  /* scrollbar itself */
  .qualities-list-block-content::-webkit-scrollbar-thumb {
    background-color:#babac0;
    border-radius:16px;
    border:5px solid #fff
  }
  .qualities-list-block-content::-webkit-scrollbar-thumb:hover {
    background-color:#a0a0a5;
    border:4px solid #f4f4f4
  }
  /* set button(top and bottom of the scrollbar) */
  .qualities-list-block-content::-webkit-scrollbar-button {display:none}

  .upload-quality-str {
    display: flex;
    justify-content: center;
    text-transform: uppercase;
    font-size: 13px;
    color: #326da8;
    font-weight: 400;
  }

  .lack-of-qualities-str {
    font-size: 2em;
    font-weight: 500;
    color: #3d83f7;
    opacity: 0.5;
    padding-left: 10px;
  }
  .search-quality-field {
    height: 46px;
  }
  .search-quality-field .v-label {
    left: 5px !important;
  }
</style>
