<template>
<v-layout class="downtime-layout">
<<<<<<< HEAD
  <v-flex class="toolbar ma-0" v-if="$vuetify.breakpoint.smAndDown">
    <v-btn class="col-12 ma-0 close-btn" @click="changeDowtimesTableView" text outlined>{{ $t('mes.buttons.Close') }}</v-btn>
  </v-flex>
  <v-flex class="downtime-flex"  :class="$vuetify.breakpoint.smAndDown? 'small' : ''" v-if="initializeDowntimes" :key="this.downtimeFormioKey">
    <formio-component
=======
  <v-flex class="downtime-flex" v-if="initializeDowntimes" :key="this.downtimeFormioKey">
    <formio-form-component
>>>>>>> master
      v-if="selectedDowntime"
      ref="formioComponent"
      @formSubmit=formSubmit
      :formDefinition=downtimeFormio
      :formCode=workCenter.downtimeRegistrationFormCode
    />
    </v-flex>
  </v-layout>
</template>

<script>

export default {
  name: 'mes-downtime-main-layout',
  props: {
    initializeDowntimes: Boolean,
  },
  data() {
    return {
      downtimeFormioKey: 0
    }
  },
  computed: {
    selectedDowntime() {
      return this.$store.getters['mes/selectedDowntime']
    },
    workCenter() {
      return this.$store.getters['mes/workCenter']
    },
    downtimeFormio() {
      this.downtimeFormioKey += 1
      return this.$store.getters['mes/downtimeFormio']
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
        formCode = me.workCenter.downtimeRegistrationFormCode,
        properties = { workCenterCode: me.workCenter.code },
        currentDate = new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toJSON()
        
      me.$store.commit('mes/setDialogLinearLoaderMessage', me.$t('mes.dialogs.RegistrationDowntime'))
      
      await me.$store.dispatch('formio/submitForm', { formCode, submission, properties }).then(result => {
        me.$store.commit('mes/setDowntimes', [])
        me.$store.dispatch('mes/downloadDowntimes', { workCenterCode: me.workCenter.code, dateTime: currentDate, fetchPolicy: 'network-only' })
        
        completeSubmissionCallback(result)
      })

      me.$store.commit('mes/closeDialogLinearLoader')
    },
    getFormioData() {
      return this.$refs.formioBuilder[0].getFormSubmission()
    },
    changeDowtimesTableView() {
      this.$emit('changeDowtimesTableView', true)
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
.downtime-layout {
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
.downtime-flex {
  position: absolute;
  height: 100%;
  overflow-y: auto;
  width: 100%;
}
.small {
    top: 60px;
}
.downtime-flex::-webkit-scrollbar {
  background-color:#fff;
  width:16px
}
.downtime-flex::-webkit-scrollbar-track {
    background-color:#fff
}
.downtime-flex::-webkit-scrollbar-track:hover {
    background-color:#f4f4f4
}

/* scrollbar itself */
.downtime-flex::-webkit-scrollbar-thumb {
    background-color:#babac0;
    border-radius:16px;
    border:5px solid #fff
}
.downtime-flex::-webkit-scrollbar-thumb:hover {
    background-color:#a0a0a5;
    border:4px solid #f4f4f4
}

/* set button(top and bottom of the scrollbar) */
.downtime-flex::-webkit-scrollbar-button {display:none}
</style>
