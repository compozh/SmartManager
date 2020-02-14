<template>
	<v-container class="column pa-0 fill-height" fluid >
    <Split  @onDragEnd="onSplitDragEnd" :gutterSize="12">
      <SplitArea :size="100 - splitSize" class="diagram-section">
          <bpmn-modeler v-if="type == 'BPMN'" :onlyRead="true" ref="bpmnModeler"/>
          <dmn-modeler v-else :onlyRead="true" ref="dmnModeler"/>
      </SplitArea>
      <SplitArea :size="splitSize" :minSize="0" class="properties-panel-section">
        <div class="properties-panel-container" >
          <v-toolbar dense height="40" flat class="modeler-toolbar elevation-1 ">
            {{$t('bpmn.labels.Milestones')}}
          </v-toolbar>
          <v-list class="milestones-list" v-if="diagram">
            <v-list-item-group>
              <v-subheader>{{ diagram.editTime || diagram.creationTime | formatDate }}</v-subheader>
              <v-list-item class="row d-flex ma-1"  >
                <v-list-item-avatar class="ma-0">
                  <v-avatar color="blue-grey lighten-1" :title="findUser(diagram.editorId )"> {{findUser(diagram.editorId || diagram.ownerId) | formatAvatar}}</v-avatar>
                </v-list-item-avatar>
                <v-list-item-content style="text-align: start" class="px-2 py-2">
                  <v-list-item-title>{{$t('bpmn.labels.LatestVersion')}}</v-list-item-title>
                  <v-list-item-subtitle>{{ diagram.editTime || diagram.creationTime | formatTime }}</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action class="ma-0">
                  <bpmn-contex-menu :item="diagram" :milestones="true"
                    @edit="editItem" 
                    @remove="removeItem" 
                    offset>
                  <template #activator="{ open }">
                    <v-btn icon class="options"   v-on="open">
                      <v-icon size="20">mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>
                </bpmn-contex-menu>
                </v-list-item-action>
              </v-list-item>
              <!-- <v-divider /> -->
              <!-- <v-list-item class="row d-flex ma-1 v-list-item--link" >
                <v-list-item-avatar class="ma-0">
                  <v-icon size="18">mdi-pencil</v-icon>
                </v-list-item-avatar>
                <v-list-item-content style="text-align: start" class="px-2 py-2">
                  <v-list-item-title> name of version</v-list-item-title>
                  <v-list-item-subtitle> time  & created by who</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action class="ma-0">
                  <bpmn-contex-menu :item="diagram"
                      offset
                      @edit="editItem" :crumb="true"
                      @remove="removeItem" >
                    <template #activator="{ on }">
                      <v-btn icon v-on="on">
                        <v-icon size="18" color="grey lighten-1">mdi-dots-vertical</v-icon>
                      </v-btn>
                  </template>
                </bpmn-contex-menu>
                </v-list-item-action>
              </v-list-item> -->
            </v-list-item-group>
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
import { Diagram, DiagramType, AccessRights } from '../../api/models';
import { formMixin } from '../mixins';
export default {
  name: 'bpmn-milestones',
  mixins: [ formMixin ],
  data () {
    return {
      users: [],
      loading: false,
      split: null,
    };
  },
  
  mounted() {
    // this.compare()
  },

  filters: {
    formatDate(value) {
      if (value) {
        moment.locale('ru');
        return moment(value).calendar(null, {
            sameElse: 'DD MMMM YYYY'
        }).split(',')[0];
      }
    },
    formatTime(value) {
      if (value) {
        moment.locale('ru');
        return moment(value).format('HH:mm');
      }
    },
    formatAvatar(value) {
      return value.length > 4 ? value.split(' ').map( el => el.slice(0,1)).join('') : value;
    }
  },

  computed: {
    diagram() {
      const activeItem = this.$store.state.bpmn.activeItem;
      if (activeItem && activeItem instanceof Diagram) {
        this.loadUsers()
        return activeItem;
      }
      return null;
    },
    type() {
      if(!this.diagram) {return}
      return this.diagram.type
    },
    splitSize: {
      get() {
        if (this.split === null) {
          let size = localStorage.getItem('properties-panel-split-size');
          if (typeof size !== 'string' || size === '') {
            size = '20';
          }
          return Number.parseInt(size);
        }
        return this.split;
      },
      set(value) {
        this.split = value;
        localStorage.setItem('properties-panel-split-size', value);
      }
    },
  },
  methods: {
    onSplitDragEnd(size) {
      this.splitSize = 100 - Number.parseInt(size);
    },
    async loadUsers() {
      this.users = await this.$store.dispatch('bpmn/queryUsers');
    },
    findUser(userId) {
      if (this.users.length == 0 || !this.users) { 
        
        return userId;
      }
      let user = this.users.find( user => user.id == userId ),
        result = user ? user.name : userId;
      return result;
    },
    async compare() {
      let changes
      this.diagram.xmlView = await this.$store.dispatch('bpmn/getXml', this.diagram.id)
      let xml = await this.$store.dispatch('bpmn/getXml', "1c67ec53-cc27-4d10-9171-1610d595b23f")
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

      let self = this
      await loadModels(this.diagram.xmlView, xml, function(err, aDefinitions, bDefinitions) {
        changes = diff(aDefinitions, bDefinitions)
      });
      console.log(this.$refs.bpmnModeler, this.diagram)
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