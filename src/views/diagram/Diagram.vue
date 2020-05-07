<template>
  <div class="fill-height">
    <div class="d-flex fill-height" style="background: white;">
      <v-overlay absolute opacity="0" v-model="loading">
        <v-progress-circular indeterminate size="70" width="7" color="primary"></v-progress-circular>
      </v-overlay>
      <div class="diagram-viewer" ref="container"></div>
    </div>
  </div>
</template>

<script>
import { tasks } from '@/mixins/units'

export default {
  name: 'Diagram',
  mixins: [tasks],
  data () {
    return {
      viewer: undefined,
      loading: false
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
        const definitions = await this.getDefinitions(info, this.viewer.get('moddle'))
        this.viewer.importDefinitions(definitions, (error) => {
          if (error) {
            console.error(error)
            this.$store.commit('SET_NOTIFY', {
              text: error.message || this.$t('notify.bpImportError'),
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
        moddle.fromXML(extTaskInfo.processXml, (error, definitions) => {
          if (error) {
            reject(error)
            return
          }

          const diagram = definitions.get('diagrams')[0]
          const plane = diagram.plane

          extTaskInfo.history.forEach((elementId, i, array) => {
            const di = plane.planeElement.find(el => el.bpmnElement.id === elementId)
            di.stroke = '#808080'

            const nextElelemtId = array[i + 1]
            if (nextElelemtId) {
              const el = di.bpmnElement
              const conn = el.get('outgoing').find(conn => conn.targetRef && conn.targetRef.id === nextElelemtId)
              const connDI = plane.planeElement.find(el => el.bpmnElement.id === conn.id)
              connDI.stroke = '#808080'
            }
          })

          const activeActivityDI = plane.planeElement.find(el => el.bpmnElement.id === extTaskInfo.currentActivity)
          activeActivityDI.stroke = '#00D400'

          resolve(definitions)
        })
      })
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
</style>
