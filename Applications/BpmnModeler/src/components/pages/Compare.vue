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
import { Diagram, DiagramType, AccessRights } from '../../api/models';
import { formMixin } from '../mixins';
export default {
  name: 'bpmn-milestones',
  mixins: [ formMixin ],
  data () {
    return {
      loading: false,
      split: null,
    };
  },
  computed: {
    diagram1() {
      if (!this.$store.state.bpmn.activeItem) { return; }
      const activeId = this.$route.query.id2;
      let item = this.$store.getters['bpmn/getItemById'](activeId).item;
      if (activeId && item instanceof Diagram) {
        return item;
      }
      return null;
    },
    diagram2() {
      if (!this.$store.state.bpmn.activeItem) { return; }
      const activeItem = this.$store.state.bpmn.activeItem;
      if (activeItem && activeItem instanceof Diagram) {
        return activeItem;
      }
      return null;
    },
    type() {
      if (!this.diagram1) { return; }
      return this.diagram1.type;
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
    addColor(changes, modeler, type, color, icon) {
      let elements =  Object.keys(changes[type]);

      let shapes = elements.map( el => modeler.elementRegistry.get(el));
      shapes.forEach( elem => {
        if (!elem) { return; }
        let  overlayHtml;
        switch (elem.constructor.name) {
        case 'Shape':
          overlayHtml = `<div class="${type.substr(1)} ${elem.id}" style="width:${elem.width + 10}px; height: ${elem.height + 10}px" >
                          <span class="v-icon mdi ${icon} black--text compare-icon" style="right: -${elem.width / 2 + 5}px" title="${type.substr(1)}"></span>
                        </div>`;
          break;
        case 'Connection':
          let polylines = document.querySelectorAll(`[data-element-id="${elem.id}"]`);
          polylines.forEach( el => {
            el.children[0].firstChild.style.strokeDasharray = '10,10';
            el.children[0].firstChild.style.stroke = color;
            el.children[0].firstChild.style.strokeWidth = '2px';
          });

          overlayHtml = `<div class="${elem.id}"></div>`;
          break;
        default:
          overlayHtml = `<div></div>`;
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
    async compare() {
      let changes;
      this.diagram1.xmlView = await this.$store.dispatch('bpmn/getXml', this.diagram1.id);
      this.diagram2.xmlView = await this.$store.dispatch('bpmn/getXml', this.diagram2.id);
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
      await loadModels(this.diagram1.xmlView, this.diagram2.xmlView,  (err, aDefinitions, bDefinitions) => {
        changes = diff(aDefinitions, bDefinitions);
        Object.entries(changes).forEach( item => {
          let color, icon;
          switch (item[0]) {
          case '_layoutChanged':
            color = 'blue';
            icon = 'mdi-pencil';
            break;
          case '_changed':
            color = 'orange';
            icon = 'mdi-pencil';
            break;
          case '_removed':
            color = 'red';
            icon = 'mdi-minus-circle-outline';
            break;
          case '_added':
            color = 'green';
            icon = 'mdi-plus-circle-outline';
            break;
          default:
            
            break;
          }
          self.addColor(changes, self.$refs.modeler1, item[0], color, icon);
          self.addColor(changes, self.$refs.modeler2, item[0], color, icon);
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
