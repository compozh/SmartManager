<template>
	<v-container class="column pa-0 fill-height compare-component" fluid>
    <Split @onDragEnd="onSplitDragEnd" :gutterSize="12">
      <SplitArea :size="100 - splitSize - splitDiffSize " class="diagram-left-section diagram-section">
        <copmpare-modeler :fullScreenVisible="false" attitude="left" :diagram="diagram" :version="diagram1" ref="modeler1" :type="type" @compare="compare" />
      </SplitArea>
      <SplitArea :size="splitSize" :minSize="0" class="diagram-right-section diagram-section">
        <copmpare-modeler :fullScreenVisible="false" attitude="right" :diagram="diagram" :version="diagram2" :type="type" ref="modeler2"  @compare="compare" />
      </SplitArea>
      <SplitArea :size="splitDiffSize" :minSize="1" class="difference-section difference-section">
        <div class="difference-panel-container" >
          <v-toolbar dense height="40" flat class="modeler-toolbar elevation-1 ">
            {{$t('bpmn.labels.Differences')}}
          </v-toolbar>
          <v-list class="difference-list md-scroll" v-if="diagram">
            <v-list-item-group v-for="type in Object.entries(changes) " :key="type[0]" >
              <div v-if="Object.keys(type[1]).length > 0">
                <v-subheader>{{ $t(`bpmn.labels.${type[0].substr(1)}`)}}</v-subheader>
                <v-divider :class="type[0].substr(1)" style="width: 90%" />
                <v-list-group v-for="item in type[1]" :key="item.id" @click="choose(item.model ? item.model.id : item.id)" sub-group no-action ripple v-model="item.active">
                  <template v-slot:activator>
                    <v-list-item-content>
                      <v-list-item-title class="item-title">{{ (item.model ? item.model.name : item.name) || $t('bpmn.labels.Element')}}</v-list-item-title>
                      <v-list-item-subtitle class="item-subtitle">{{ item.model ?  item.model.$type.replace('bpmn:', '') : item.$type.replace('bpmn:', '') }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </template>
                    <div class="difference-description">{{item}}</div>
                </v-list-group>
                <v-divider />
              </div>
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
        if (this.type !== 'BPMN') {
          return 0;
        }
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
        if (this.type !== 'BPMN') {
          return;
        }
        value = value == 0 ? 1 : value;
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
          var shapes = document.querySelectorAll(`[data-element-id="${elem.id}"]`);
          shapes.forEach(el => {
            el.children[0].firstChild.style.fill = color;
            el.children[0].firstChild.style.fillOpacity = 0.5;
          });
          overlayHtml = `<div class="${type.substr(1)} ${elem.id}" style="width:${elem.width + 10}px; height: ${elem.height + 10}px" >
                          <i class="compare-icon mdi ${icon}"></i>
                        </div>`;
          break;
        case 'Connection':
          polylines = document.querySelectorAll(`[data-element-id="${elem.id}"]`);
          polylines.forEach( el => {
            el.children[0].firstChild.style.strokeDasharray = '10,2';
            el.children[0].firstChild.style.stroke = color;
            el.children[0].firstChild.style.strokeOpacity = 0.7;
            el.children[0].firstChild.style.strokeWidth = '2px';
          });
          var length = elem.waypoints.length - 1,
            width = Math.abs(elem.waypoints[0].x - elem.waypoints[length].x) + 10,
            height = Math.abs(elem.waypoints[0].y - elem.waypoints[length].y) + 10;
          overlayHtml = `<div class="${type.substr(1)} ${elem.id}" style="width:${width}px; height:${height}px"></div>`;
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
      this.scrollToElement(id);
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
          changing = true;
          var box  = b.get('canvas');
          box.viewbox(e.viewbox);
          changing = false;
        });
      }
      syncViewbox(currentDiagramm, milestoneDiagramm);
      syncViewbox(milestoneDiagramm, currentDiagramm);
      this.initSyncViewers = true;
    },
    scrollToElement(id) {
      let modeler1 = this.$refs.modeler1,
        modeler2 = this.$refs.modeler2;
      if (!modeler1 || !modeler2 ) {
        return;
      }
      var modeler = modeler1.modeler.get('elementRegistry').get(id) ? modeler1 : modeler2,
        viewer = modeler.modeler,
        modelerElement = modeler.$el,
        element = viewer.get('elementRegistry').get(id);
      if (!element || !modelerElement) {
        return;
      }
      let modelerHeight = modelerElement.offsetHeight,
        modelerWidth = modelerElement.offsetWidth,
        x,
        y;
      if (element === viewer.get('canvas').getRootElement()) {
        x = (modelerWidth / 2);
        y = (modelerHeight / 2) - 100;
      } else
      if (element.waypoints) {
        x = element.waypoints[0].x;
        y = element.waypoints[0].y;
      } else {
        x = element.x + element.width / 2;
        y = element.y + element.height / 2;
      }
      viewer.get('canvas').viewbox({
        x: x - (modelerWidth / 2),
        y: y - ((modelerHeight / 2) - 100),
        width: modelerWidth,
        height: modelerHeight
      });
    }
  },
};
</script>
<style lang="scss" scoped>
.compare-component {
  max-height: calc(100vh - 50px);
}
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
  height: calc(100% - 40px) !important;
  text-align: start;
  height: 100%;
  overflow-y: auto;
  padding: 0;
  .item-title {
    font-size: 13px;
  }
  .item-subtitle {
    font-size: 12px;
  }
}
.difference-description {
  padding: 0 20px !important;
  color: #848484;
  font-size: 12px;
}

.md-scroll::-webkit-scrollbar {
    background-color:#fff;
    width:16px;
    height: 16px
  }
  /* background of the scrollbar except button or resizer */
  .md-scroll::-webkit-scrollbar-track {
      background-color:#fff
  }
  .md-scroll::-webkit-scrollbar-track:hover {
      background-color:#fff
  }

  /* scrollbar itself */
  .md-scroll::-webkit-scrollbar-thumb {
      background-color:#babac0;
      border-radius:16px;
      border:5px solid #fff
  }
  .md-scroll::-webkit-scrollbar-thumb:hover {
      background-color:#a0a0a5;
      border:4px solid #f4f4f4
  }
  /* set button(top and bottom of the scrollbar) */
  .md-scroll::-webkit-scrollbar-button {display:none}

</style>
<style lang="scss">
  .added {
    &.v-divider {
      border-width: 2px;
      background-color: rgba(0,128,0,.5);
    }
    &.choosed, &.found {
      box-shadow: 0 0 6px 0px rgba(0, 0, 0, 0.75)
    }
  }
  .layoutChanged {
    &.v-divider {
      border-width: 2px;
      background-color: rgba(0,0,255,.5);
    }
    &.choosed, &.found {
      box-shadow: 0 0 6px 0px rgba(0, 0, 0, 0.75)
    }
  }
  .changed {
    &.v-divider {
      border-width: 2px;
      background-color: rgba(255, 165, 0,.5)
    }
    &.choosed, &.found {
      box-shadow: 0 0 6px 0px rgba(0, 0, 0, 0.75)
    }
  }
  .removed {
    &.v-divider {
      border-width: 2px;
      background-color: rgba(255, 0, 0,.5)
    }
    &.choosed, &.found {
      box-shadow: 0 0 6px 0px rgba(0, 0, 0, 0.75)
    }
  }
  .compare-icon {
    position: absolute;
    right:0;
    top: -3px;
  }
  .workflow-modeler {
    height: 100%;
    background: white
  }
</style>
