<template>
	<v-container class="column pa-0 fill-height" fluid >
    <Split @onDragEnd="onSplitDragEnd" :gutterSize="12">
      <SplitArea :size="100 - splitSize - splitDiffSize " class="diagram-left-section diagram-section">
        <copmpare-modeler :diagram="diagram" :version="diagram1" ref="modeler1" :type="type" @compare="compare" />
      </SplitArea>
      <SplitArea :size="splitSize" :minSize="0" class="diagram-right-section diagram-section">
        <copmpare-modeler :diagram="diagram" :version="diagram2" :type="type" ref="modeler2"  @compare="compare" />
      </SplitArea>
      <SplitArea :size="splitDiffSize" :minSize="0" class="difference-section difference-section">
        <div class="difference-panel-container" >
          <v-toolbar dense height="40" flat class="modeler-toolbar elevation-1 ">
            {{$t('bpmn.labels.Differences')}}
          </v-toolbar>
          <v-list class="difference-list" v-if="diagram">
            <v-list-item-group  v-for="type in Object.entries(changes) " :key="type[0]"  v-if="Object.keys(type[1]).length > 0">
              <v-subheader>{{ $t(`bpmn.labels.${type[0].substr(1)}`)}}</v-subheader>
              <v-divider :class="type[0].substr(1)" style="width: 90%" />
              <v-list-item class="row d-flex ma-1 pl-1" v-for="item in type[1]" :key="item.id" @click="choose(item.model ? item.model.id : item.id)">
                <v-list-item-icon class="list-icon mx-0">
                  <v-icon size="17">mdi-chevron-right</v-icon>
                </v-list-item-icon>
                <v-list-item-content style="text-align: start" class="px-2 py-2">
                  <v-list-item-title>{{ (item.model ? item.model.name : item.name) || $t('bpmn.labels.Element')}}</v-list-item-title>
                  <v-list-item-subtitle>{{ item.model ?  item.model.$type.replace('bpmn:', '') : item.$type.replace('bpmn:', '') }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-divider />
            </v-list-item-group>
            <v-divider />
          </v-list>
        </div>
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
      splitDiff: null,
      versions: [],
      changes: {}
    };
  },
  computed: {
    diagram() {
      const diagram = this.$store.state.bpmn.activeItem || this.$store.getters['bpmn/getItemById'](this.$route.params.id).item;
      if (diagram && diagram instanceof Diagram) {
        return diagram;
      }
      return null;
    },
    diagram1() {
      const itemId = this.$route.query.left;
      const item = this.versions.find( el => itemId ==  el.versionId) || this.$store.getters['bpmn/getItemById'](itemId).item;
      if (itemId && item instanceof Diagram || item instanceof DiagramVersion) {
        return item;
      }
      return null;
    },
    diagram2() {
      const itemId = this.$route.query.right;
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
    splitDiffSize: {
      get() {
        if (this.splitDiff === null) {
          let size = localStorage.getItem('properties-panel-split-size');
          if (typeof size !== 'string' || size === '') {
            size = '20';
          }
          return Number.parseInt(size);
        }
        return this.splitDiff;
      },
      set(value) {
        this.splitDiff = value;
        localStorage.setItem('properties-panel-split-size', value);
      }
    },
  },
  methods: {
    onSplitDragEnd(size) {
      this.splitDiffSize = Number.parseInt(size[2]);
      this.splitSize = Number.parseInt(size[1]);
    },
    async getVersions() {
      if (!this.diagram || this.versions.length > 0) { return; }
      let versions = await this.$store.dispatch('bpmn/getVersionsForDiagram', this.diagram.id);
      this.versions = versions;
    },
    addColor(modeler, type, color, icon) {
      let elements =  Object.keys(this.changes[type]),
        overlays = modeler.modeler.get('overlays'),
        elementRegistry = modeler.modeler.get('elementRegistry'),
        shapes = elements.map( el => elementRegistry.get(el)),
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
        overlays.add(elem.id , {
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
        this.changes = diff(aDefinitions, bDefinitions);
        Object.entries(this.changes).forEach( item => {
          let color, icon;
          switch (item[0]) {
          case '_layoutChanged':
            color = 'blue';
            icon = 'mdi-pencil';
            self.addColor(self.$refs.modeler1, item[0], color, icon);
            self.addColor(self.$refs.modeler2, item[0], color, icon);
            break;
          case '_changed':
            color = 'orange';
            icon = 'mdi-pencil';
            self.addColor(self.$refs.modeler1, item[0], color, icon);
            self.addColor(self.$refs.modeler2, item[0], color, icon);
            break;
          case '_removed':
            color = 'red';
            icon = 'mdi-minus-circle-outline';
            self.addColor(self.$refs.modeler1, item[0], color, icon);
            break;
          case '_added':
            color = 'green';
            icon = 'mdi-plus-circle-outline';
            self.addColor(self.$refs.modeler2, item[0], color, icon);
            break;
          default:
            break;
          }
        });
      });
      self.syncViewers(self.$refs.modeler1.modeler, self.$refs.modeler2.modeler);

    },
    choose(id) {
      let choosed = document.querySelectorAll('.choosed');
      if (choosed) {
        choosed.forEach( el => el.classList.remove('choosed'));
      }
      let elements = document.querySelectorAll(`.${id}`);
      elements.forEach( el => el.classList.add('choosed'));

    },
    findElem(id) {
      let elements = document.querySelectorAll(`.${id}`);
      elements.forEach( el => el.classList.toggle('found'));
    },
    syncViewers(currentDiagramm, milestoneDiagramm) {
      if (this.initSyncViewers) {
        return;
      }
      var changing = false;

      function syncViewbox(a, b) {
        a.on('canvas.viewbox.changed', (e) => {
          if (changing) {
            changing = false;
            return;
          }
          b.get('canvas').viewbox(e.viewbox);
          changing = true;
        });
      }

      syncViewbox(currentDiagramm, milestoneDiagramm);
      syncViewbox(milestoneDiagramm, currentDiagramm);
      this.initSyncViewers = true;
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
.difference-panel-section, .difference-panel-container {

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

.difference-list {
  height: 100%;

  .list-icon {
  }
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
    background-color: rgba($color: green, $alpha: 0.2);
    &.v-divider {
      background-color: green
    }
    &.choosed, &.found {
      box-shadow: 5px 5px 5px green, -5px -5px 5px green,  5px -5px 5px green, -5px 5px 5px green
    }
  }
  .layoutChanged {
    border: 2px solid blue;
    background-color: rgba($color: blue, $alpha: 0.2);
    &.v-divider {
      background-color: blue
    }
    &.choosed, &.found {
      box-shadow: 5px 5px 5px blue, -5px -5px 5px blue,  5px -5px 5px blue, -5px 5px 5px blue
    }
  }
  .changed {
    border: 2px solid orange;
    background-color: rgba($color: orange, $alpha: 0.2);
    &.v-divider {
      background-color: orange
    }
    &.choosed, &.found {
      box-shadow: 5px 5px 5px orange, -5px -5px 5px orange,  5px -5px 5px orange, -5px 5px 5px orange
    }
  }
  .removed {
    border: 2px solid red;
    background-color: rgba($color: red, $alpha: 0.2);
    &.v-divider {
      background-color: red
    }
    &.choosed, &.found {
      box-shadow: 5px 5px 5px red, -5px -5px 5px red,  5px -5px 5px red, -5px 5px 5px red
    }
  }
  .compare-icon::before {
    position: relative;
    top: -26px;
  }
  .workflow-modeler {
    height: 100%;
    background: white
  }
</style>
