<template>
<v-layout class="downtime-layout">
  <v-flex class="toolbar ma-0" v-if="$vuetify.breakpoint.smAndDown">
    <v-btn class="col-12 ma-0 close-btn" @click="changeDowtimesTableView" text outlined>{{ $t('mes.buttons.Close') }}</v-btn>
  </v-flex>
  <v-flex class="downtime-flex"  :class="$vuetify.breakpoint.smAndDown? 'small' : ''" v-if="initializeDowntimes" :key="this.downtimeFormioKey">
    <formio-component
      v-if="selectedDowntime"
      ref="formioBuilder"
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
    }
  },
  methods: {
    async formSubmit(submission) {
      var me = this,
        formCode = me.workCenter.downtimeRegistrationFormCode,
        properties = { workCenterCode: me.workCenter.code },
        currentDate = new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toJSON()
        
      me.$store.commit('mes/setDialogLinearLoaderMessage', me.$t('mes.dialogs.RegistrationDowntime'))
      
      await me.$store.dispatch('formio/submitForm', { formCode, submission, properties }).then(result => {
        me.$store.commit('mes/setDowntimes', [])
        me.$store.dispatch('mes/downloadDowntimes', { workCenterCode: me.workCenter.code, dateTime: currentDate, fetchPolicy: 'network-only' })        
      })

      me.$store.commit('mes/closeDialogLinearLoader')
    },
    getFormioData() {
      return this.$refs.formioBuilder[0].getFormSubmission()
    },
    changeDowtimesTableView() {
      this.$emit('changeDowtimesTableView', true)
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
