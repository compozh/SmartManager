<template>
  <v-card class="item-card pa-2" elevation="1" :loading="loading">
    <v-card-text @click="openProject(item)" ref="container" class="preview" >
    </v-card-text>
    <v-card-title class="justify-space-between py-1 px-2 mt-auto mx-0 row">
      <v-col class="py-0 col-11">
        <v-row>
          <bpmn-tree-icon :node="item"></bpmn-tree-icon>
          <h1 class="pl-2" :title="item.name">{{item.name}}</h1>
          <h2>{{$t('bpmn.labels.EditTime')}}: </h2> <h2 class="pl-1">{{item.editTime || item.creationTime | formatDate}}</h2>
        </v-row>
      </v-col>
      <v-checkbox v-model="choose" v-if="chosen" class="ma-0 checkbox"/>
    </v-card-title>
  </v-card>
</template>

<script>
import moment from 'moment'
import { events } from '../../constants';
import { CancellationToken, editorFactory } from '../../api';
import { eventBus } from '../../main';
import { editorToolbarMixin } from '../mixins';
import { debounce } from 'throttle-debounce';
export default {
  name: 'item-card',
  data() {
    return {
      modeler: null,
      loading: false,
      cancellationToken: new CancellationToken(),
      onElementChanged: null,
      preview: null
    };
  },
  props: {
    item: Object,
    activeItem: String,
    chosen: Array
  },
  filters: {
    formatDate: (value) => {
      if (value) {
        moment.locale('ru')
        return moment(value).calendar();
      }
    },
  },
  mounted() {
    if (this.item) {
      this.createModeler()
    }
  },
  methods: {
    createModeler() {
      this.modeler = editorFactory(this.item.type, true, this.$refs.container, null, () => {})
      this.loadXml();
    },
    setBpmnSvg() {
      let self = this
      this.modeler.saveSVG((err, svg) => {
        if (err) {
          console.error(err);
          return;
        }
        self.preview = svg 
        self.$refs.container.innerHTML = svg
      });
    },
    setDmnSvg() {
      let svg = this.$refs.container.querySelector('svg')
      if(!svg) {return}
      this.preview = svg 
      svg.setAttribute('viewBox' , "0 0 1000 600")
      this.$refs.container.innerHTML = svg.outerHTML
    },
    async loadXml() {
      if (!this.item || !this.modeler) {
        return;
      }
      this.loading = true;
      if (!this.cancellationToken.isCancelled) {
        this.cancellationToken.cancel();
      }
      
      const debounced = debounce(500, async (cancellationToken) => {
        const xml = await this.$store.dispatch('bpmn/getXml', this.item.id);
        if (cancellationToken.isCancelled) {
          return;
        }
        if (xml === false) {
          this.loading = false;
          // TODO: display exception
          return;
        }
        if (!xml || xml === '') {
          if(this.modeler.createDiagram){
            this.modeler.createDiagram(() => {
              this.loading = false;
            })
          } else {
            this.loading = false;
            }
        } else {
          this.modeler.importXML(xml, (err) => {
            this.loading = false;
            if (err) {
              console.error(err);
              // TODO: display exception
              this.modeler.createDiagram();
              this.loading = false;
            }
          })
        }
      })

      this.cancellationToken = new CancellationToken(debounced);
      debounced(this.cancellationToken);
    },
    openProject(el) {
      this.active = el
    },
  },
  updated() {
    if (this.preview || this.loading) {return}
    if (this.item.type == 'BPMN') {
      eventBus.$on(events.modeler.export, this.setBpmnSvg)
      eventBus.$emit(events.modeler.export, 'svg')
      eventBus.$off(events.modeler.export, this.setBpmnSvg)
    }  else if (this.item.type == 'DMN'){
      this.setDmnSvg()
    }
  },
  computed: {
    active: {
      get() {
        return this.activeItem;
      },
      set(value) {
        if (value === this.activeItem) {
          return;
        }
        this.$emit('update:activeItem', value);
      }
    },
    choose: {
      get() {
        return this.chosen.find( el => el.id == this.item.id);
      },
      set(value) {
        this.$emit('choosed', this.item)        
      }
    }
  },
};
</script>
<style lang="scss" scoped>
.item-card {
  height: 100%;
}
.v-card__text{
  cursor: pointer;
  height: 155px;
  min-height: 155px;
  max-height: 155px;
}
.v-card__title {
  height: calc(100% - 155px);
  flex-wrap: nowrap;
  cursor: default;
}

h1 {
  color: #535353;
  font-size: 22px;
  font-weight: 700;
  vertical-align: bottom;
  text-align: start;
  height: 32px;
  width: calc(100% - 30px);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.preview {
  max-height: 200px;
  padding: 0;
}
h2 {
  line-height: 20px;
  color: #535353;
  font-size: 13px;
  font-weight: 500;
  vertical-align: bottom;
}
.v-card__progress  {
  height: 0;
}
.checkbox {
  height: 25px;
  align-self: flex-end;
}
</style>
<style lang="scss">
.checkbox  .v-messages {
  display: none;
}
.item-card  svg, .item-card .js-container svg d{
  max-width: 100%;
  max-height: 155px;
}
.item-card .dmn-decision-table-container{
  overflow: hidden;

  th, td {
    min-width: unset;
    min-height: unset;
    line-height: normal;
  }
}
.item-card .tjs-container {
  position: relative;
  top: -20px;
  font-size: 0.7em
}
.v-input--selection-controls__ripple { z-index: 1; }
</style>