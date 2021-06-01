<template>
  <div class="fill-height">
    <div class="d-flex fill-height" style="background: white;" ref="layout">
      <v-overlay absolute opacity="0" v-model="loading">
        <v-progress-circular indeterminate size="70" width="7" color="primary"></v-progress-circular>
      </v-overlay>
      <div class="diagram-viewer" ref="container"></div>
      <v-row class="options-panel grey lighten-4"
             :style="`${isRight}: 30px;`">
        <v-btn text :disabled="!canZoom" @click="zoomIn()" :title="$t('buttons.zoomIn')">
          <fa-icon icon="search-plus" size="lg"/>
        </v-btn>
        <v-btn text :disabled="!canZoom" @click="zoomOut()" :title="$t('buttons.zoomOut')">
          <fa-icon icon="search-minus" size="lg"/>
        </v-btn>
        <v-btn text :disabled="!canZoom" @click="zoomReset()" :title="$t('buttons.zoomReset')">
          <fa-icon icon="search" size="lg"/>
        </v-btn>
        <v-divider vertical></v-divider>
        <v-btn text @click="fullScreen = !fullScreen" :title="$t('buttons.toggleFullscreen')">
          <fa-icon v-if="fullScreen" icon="compress-arrows-alt" size="lg"/>
          <fa-icon v-else icon="compress" size="lg"/>
        </v-btn>
      </v-row>
    </div>
  </div>
</template>

<script>
import { tasks } from '@/mixins/units'
import fullScreenMixin from '@/mixins/fullScreenMixin'

export default {
  name: 'Diagram',
  mixins: [tasks, fullScreenMixin],
  data () {
    return {
      viewer: undefined,
      loading: false
    }
  },
  computed: {
    canZoom () {
      return this.viewer && !!this.viewer.get('zoomScroll')
    }
  },
  watch: {
    externalParams: {
      immediate: true,
      async handler () {
        this.loading = true
        const info = await this.getExternalTaskInfo()
        if (this.viewer) {
          this.viewer.destroy()
        }
        this.viewer = await this.createViewer()
        let definitions
        try {
          definitions = await this.getDefinitions(info, this.viewer.get('moddle'))
        } catch (error) {
          console.error(error)
          this.$store.commit('SET_NOTIFY', {
            text: (error && error.message) || this.$t('notify.bpImportError'),
            color: 'error'
          })
          this.loading = false
          return
        }
        this.viewer.importDefinitions(definitions, (error) => {
          if (error) {
            console.error(error)
            this.$store.commit('SET_NOTIFY', {
              text: (error && error.message) || this.$t('notify.bpImportError'),
              color: 'error'
            })
            this.loading = false
            return
          }
          const canvas = this.viewer.get('canvas')
          canvas.zoom('fit-viewport')
          this.loading = false
        })
      }
    }
  },
  methods: {
    async createViewer () {
      const NavigatedViewer = await import(/* webpackChunkName: "bpmn-js" */ 'bpmn-js/lib/NavigatedViewer')
      // eslint-disable-next-line new-cap
      return new NavigatedViewer.default({
        container: this.$refs.container,
        keyboard: {
          bindTo: this.$refs.container
        }
      })
    },
    async getExternalTaskInfo () {
      return this.$store.dispatch('getExternalTaskInfo', this.externalParams.EXTERNALID)
    },
    getDefinitions (extTaskInfo, moddle) {
      return new Promise((resolve, reject) => {
        if (!extTaskInfo || !extTaskInfo.processXml) {
          reject(extTaskInfo)
        }
        moddle.fromXML(extTaskInfo.processXml, (error, definitions) => {
          if (error) {
            reject(error)
            return
          }

          const diagram = definitions.get('diagrams')[0]
          const plane = diagram.plane

          if (extTaskInfo.history) {
            extTaskInfo.history.forEach((elementId, i, array) => {
              const di = plane.planeElement.find(el => el.bpmnElement && el.bpmnElement.id === elementId)
              if (di) {
                di.set('stroke', '#808080')
                const nextElelemtId = array[i + 1]
                if (nextElelemtId) {
                  const el = di.bpmnElement
                  if (el) {
                    const conn = el.get('outgoing').find(conn => conn.targetRef && conn.targetRef.id === nextElelemtId)
                    if (conn) {
                      const connDI = plane.planeElement.find(el => el.bpmnElement && el.bpmnElement.id === conn.id)
                      connDI && connDI.set('stroke', '#808080')
                    }
                  }
                }
              }
            })
          }

          const activeActivityDI = plane.planeElement.find(el => el.bpmnElement.id === extTaskInfo.currentActivity)
          activeActivityDI.stroke = '#00D400'

          resolve(definitions)
        })
      })
    },
    zoomIn () {
      const zoomScroll = this.viewer && this.viewer.get('zoomScroll')
      if (zoomScroll) {
        zoomScroll.stepZoom(1)
      }
    },
    zoomOut () {
      const zoomScroll = this.viewer && this.viewer.get('zoomScroll')
      if (zoomScroll) {
        zoomScroll.stepZoom(-1)
      }
    },
    zoomReset () {
      const zoomScroll = this.viewer && this.viewer.get('zoomScroll')
      if (zoomScroll) {
        zoomScroll.reset()
      }
    },
    getFullScreenContainer () {
      return this.$refs.layout
    }
  }
}
</script>
<style>
a.bjs-powered-by,
a.cjs-powered-by {
  display: none;
}
</style>
<style scoped>
.diagram-viewer {
  width: 100%;
  height: 100%;
  position: relative;
}
.options-panel {
  position: absolute;
  background-color: #f5f5f5;
  bottom: 12px;
  border: 1px solid #CCC;
  border-radius: 2px;
  z-index: 50;
}
.options-panel .v-btn {
  min-width: 45px !important
}
</style>
