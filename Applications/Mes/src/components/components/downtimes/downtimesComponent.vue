<template>
  <div class="mes-downtimes-component">
    <v-layout column class="mes-downtimes-component-layout">
      <v-flex class="downtimes-list-blocks">
        <mes-content-loader
          v-if="!initializeDowntimes && !downtimes.length"
          :loaderType=loaderType
        />
        <vue-pull-refresh :on-refresh="onRefresh">

          <div class="downtimes-list-block-content" @scroll.passive="onScroll">
            <mes-downtime-cards
            @changeCurrentDowntime=changeCurrentDowntime
            @changeDowtimesTableView=changeDowtimesTableView
            />
            <span v-if="isUploadInProcess" class='upload-downtime-str'>{{this.$t('mes.labels.DownloadDowntimes')}}</span>
          </div>
        </vue-pull-refresh>
        <span v-if="initializeDowntimes && !downtimes.length" class="lack-of-downtimes-str">{{this.$t('mes.labels.NoDowntime')}}</span>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import VuePullRefresh from 'vue-pull-refresh'
export default {
  name: 'mes-downtimes-component',
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
    initializeDowntimes: Boolean,
    currentDate: String,
    workCenter: Object
  },
  computed: {
    downtimes() {
      return this.$store.getters['mes/downtimes']
    }
  },
  methods: {
    changeDowtimesTableView() {
      this.$emit('changeDowtimesTableView', false)
    },
    changeCurrentDowntime(newDowntime) {
      this.$emit('changeCurrentDowntime', newDowntime)
    },
    onScroll(e) {
      const me = this
      let blockHeight = e.target.scrollHeight
      let blockTop = e.target.scrollTop + 100
      let clientHeight = e.target.clientHeight
      if (!me.isUploadInProcess && blockHeight - blockTop >= clientHeight - 20 && blockHeight - blockTop <= clientHeight + 20) {
        let lastDowntimeDate = me.downtimes[me.downtimes.length - 1].eventStart
        me.$emit('uploadDowntimeOnScroll', lastDowntimeDate)
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
        this.$store.dispatch('mes/uploadDowntimes',
          { workCenterCode: this.workCenter.code, dateTime: this.currentDate })
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
.mes-downtimes-component {
    height: 100%;
    width: 30%;
    min-width: 330px
  }
  .mes-downtimes-component-layout {
    height: 100%;
  }

  .downtimes-list-block-content {
    height:100%;
    overflow-y: auto;
    position: absolute;
    width: 100%;
  }

  .downtimes-list-block-content::-webkit-scrollbar {
    background-color:#fff;
    width:16px
  }
  .v-card__text.active-task-item {
    border-top-left-radius: none !important;
    border-top-right-radius: none !important;
  }
  /* background of the scrollbar except button or resizer */
  .downtimes-list-block-content::-webkit-scrollbar-track {
    background-color:#fff
  }
  .downtimes-list-block-content::-webkit-scrollbar-track:hover {
    background-color:#f4f4f4
  }

  /* scrollbar itself */
  .downtimes-list-block-content::-webkit-scrollbar-thumb {
    background-color:#babac0;
    border-radius:16px;
    border:5px solid #fff
  }
  .downtimes-list-block-content::-webkit-scrollbar-thumb:hover {
    background-color:#a0a0a5;
    border:4px solid #f4f4f4
  }
  /* set button(top and bottom of the scrollbar) */
  .downtimes-list-block-content::-webkit-scrollbar-button {display:none}

  .upload-downtime-str {
    display: flex;
    justify-content: center;
    text-transform: uppercase;
    font-size: 13px;
    color: #326da8;
    font-weight: 400;
  }

  .lack-of-downtimes-str {
    font-size: 2em;
    font-weight: 500;
    color: #3d83f7;
    opacity: 0.5;
    padding-left: 10px;
  }
</style>
