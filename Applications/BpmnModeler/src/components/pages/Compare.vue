<template>
	<v-container class="column pa-0 fill-height" fluid >
    <Split @onDragEnd="onSplitDragEnd" :gutterSize="12">
      <SplitArea :size="100 - splitSize" class="diagram-left-section diagram-section">
          <bpmn-modeler v-if="type == 'BPMN'" :onlyRead="true" ref="modeler1" :diagram="diagram1" @compare="compare"/>
          <dmn-modeler v-else-if="type == 'DMN'" :onlyRead="true" ref="modeler1" :diagram="diagram1" @compare="compare"/>
          <cmmn-modeler v-else :onlyRead="true" ref="modeler1" :diagram="diagram1" @compare="compare"/>
      </SplitArea>
      <SplitArea :size="splitSize" :minSize="0" class="diagram-right-section diagram-section">
          <bpmn-modeler v-if="type == 'BPMN'" :onlyRead="true" ref="modeler2" :diagram="diagram2"/>
          <dmn-modeler v-else-if="type == 'DMN'" :onlyRead="true" ref="modeler2" :diagram="diagram2"/>
          <cmmn-modeler v-else :onlyRead="true" ref="modeler2" :diagram="diagram1"/>
      </SplitArea>
    </Split>
	</v-container>
</template>

<script>
import BpmnModdle from 'bpmn-moddle';
import { diff } from 'bpmn-js-differ';
import moment from 'moment';
import { Diagram, DiagramVersion } from '../../api/models';
import { formMixin } from '../mixins';
export default {
  name: 'bpmn-milestones',
  mixins: [ formMixin ],
  data () {
    return {
      loading: false,
      split: null,
      versions: [],
    };
  },
  computed: {
    diagram() {
      if (!this.$store.state.bpmn.activeItem) { return null; }
      const diagram = this.$store.state.bpmn.activeItem;
      if (diagram && diagram instanceof Diagram) {
        
        return diagram;
      }
      return null;
    },
    diagram1() {
      const itemId = this.$route.query.id1;
      const item = this.versions.find( el => itemId ==  el.versionId) || this.$store.getters['bpmn/getItemById'](itemId).item;
      if (itemId && item instanceof Diagram || item instanceof DiagramVersion) {
        return item;
      }
      return null;
    },
    diagram2() {
      const itemId = this.$route.query.id2;
      const item = this.versions.find( el => itemId ==  el.versionId) || this.$store.getters['bpmn/getItemById'](itemId).item;
      if (item && item instanceof Diagram || item instanceof DiagramVersion) {
        return item;
      }
      return null;
    },
    type() {
      if ( !this.$route.params.id && this.diagram1) { 
        return this.diagram1.type;
      } else if (this.diagram && this.$route.params.id) {
        this.getVersions();
        return this.diagram.type ;
      } else { return ''; }
    },
    splitSize: {
      get() {
        if (this.split === null) {
          let size = localStorage.getItem('compare-panel-split-size');
          if (typeof size !== 'string' || size === '') {
            size = '50';
          }
          return Number.parseInt(size);
        }
        return this.split;
      },
      set(value) {
        this.split = value;
        localStorage.setItem('compare-panel-split-size', value);
      }
    },
  },
  methods: {
    onSplitDragEnd(size) {
      this.splitSize = 100 - Number.parseInt(size);
    },
    async getVersions() {
      if (!this.diagram || this.versions.length > 0) { return; }
      let versions = await this.$store.dispatch('bpmn/getVersionsForDiagram', this.diagram.id);
      this.versions = versions;
    },
    addColor(changes, modeler, type, color, icon) {
      let elements =  Object.keys(changes[type]),
        shapes = elements.map( el => modeler.elementRegistry.get(el)),
        polylines, overlayHtml;
      shapes.forEach( elem => {
        if (!elem) { return; }
        switch (elem.constructor.name) {
        case 'Shape':
          overlayHtml = `<div class="${type.substr(1)} ${elem.id}" style="width:${elem.width + 10}px; height: ${elem.height + 10}px" >
                          <span class="v-icon mdi ${icon} black--text compare-icon" style="right: -${elem.width / 2 + 5}px" title="${type.substr(1)}"></span>
                        </div>`;
          break;
        case 'Connection':
          polylines = document.querySelectorAll(`[data-element-id="${elem.id}"]`);
          polylines.forEach( el => {
            el.children[0].firstChild.style.strokeDasharray = '10,10';
            el.children[0].firstChild.style.stroke = color;
            el.children[0].firstChild.style.strokeWidth = '2px';
          });
          overlayHtml = `<div class="${elem.id}"></div>`;
          break;
        default:
          overlayHtml = '<div></div>';
          break;
        }
        modeler.overlays.add(elem.id , {
          position: {
            top: -5,
            left: -5
          },
          html: overlayHtml
        });
      });
    },
    async getXml(diagram) {
      let xml;
      if (diagram instanceof DiagramVersion) {
        xml = await this.$store.dispatch('bpmn/getDiagramVersionXml', {versionId: diagram.versionId, diagramId: this.diagram.id});
      } else {
        xml = await this.$store.dispatch('bpmn/getXml', diagram.id);
      }
      return xml; 
    },
    async compare() {
      let changes;
      let xml1 = await this.getXml(this.diagram1),
        xml2 = await this.getXml(this.diagram2);
      function loadModels(a, b, done ) {
        new BpmnModdle().fromXML(a, function(err, adefs) {
          if (err) {
            return done(err);
          }
          new BpmnModdle().fromXML(b, function(err, bdefs) {
            if (err) {
              return done(err);
            } else {
              return done(null, adefs, bdefs);
            }
          });
        });
      }

      let self = this;
      await loadModels(xml1, xml2,  (err, aDefinitions, bDefinitions) => {
        changes = diff(aDefinitions, bDefinitions);
        Object.entries(changes).forEach( item => {
          let color, icon;
          switch (item[0]) {
          case '_layoutChanged':
            color = 'blue';
            icon = 'mdi-pencil';
            self.addColor(changes, self.$refs.modeler1, item[0], color, icon);
            self.addColor(changes, self.$refs.modeler2, item[0], color, icon);
            break;
          case '_changed':
            color = 'orange';
            icon = 'mdi-pencil';
            self.addColor(changes, self.$refs.modeler1, item[0], color, icon);
            self.addColor(changes, self.$refs.modeler2, item[0], color, icon);
            break;
          case '_removed':
            color = 'red';
            icon = 'mdi-minus-circle-outline';
            self.addColor(changes, self.$refs.modeler1, item[0], color, icon);
            break;
          case '_added':
            color = 'green';
            icon = 'mdi-plus-circle-outline';
            self.addColor(changes, self.$refs.modeler2, item[0], color, icon);
            break;
          default:
            break;
          }
        }); 
      });
      
    }
  },
};
</script>
<style lang="scss" scoped>
.diagram-section {
  width: 100%;
  height: 100%;
  grid-area: modeler;
  position: relative;
  top:2px;
  overflow: hidden;
}
.properties-panel-section {
  
  height: 100%;
  position: relative;
  overflow: hidden;
}
.bpmn-diagram-container {
  max-width: 100%;
  max-height: 100%;
  position: relative;
  top:2px;
  overflow: hidden;
}
.split {
  overflow: hidden;
}
.modeler-toolbar {
  padding-left: 10px;
  align-items: center;
  justify-content: start;
  display: flex;
  
  font-size: 15px;
  font-weight: 500;
  background-color: transparent !important
}

.milestones-list {
  .v-list-item__title {
    font-size: 13px;
  }
  .v-list-item__subtitle {
    font-size: 12px;
  }
}

</style>
<style lang="scss">
  .added {
    border: 2px solid green;
    background-color: rgba($color: green, $alpha: 0.2)
  }
  .layoutChanged {
    border: 2px solid blue;
    background-color: rgba($color: blue, $alpha: 0.2)
  }
  .changed {
    border: 2px solid orange;
    background-color: rgba($color: orange, $alpha: 0.2)
  }
  .removed {
    border: 2px solid red;
    background-color: rgba($color: red, $alpha: 0.2)
  }
  .compare-icon::before {
    position: relative;
    top: -26px;
  }
</style>
