<template>
	<v-container class="column pa-0 fill-height" fluid >
    <Split  @onDragEnd="onSplitDragEnd" :gutterSize="12">
      <SplitArea :size="100 - splitSize" class="diagram-section">
          <bpmn-modeler v-if="type == 'BPMN'" :onlyRead="true" :diagram.sync="version"  ref="modeler"/>
          <dmn-modeler v-else-if="type == 'DMN'" :onlyRead="true" :diagram="version" ref="modeler"/>
          <cmmn-modeler v-else :onlyRead="true" :diagram="version" ref="modeler"/>
      </SplitArea>
      <SplitArea :size="splitSize" :minSize="0" class="properties-panel-section">
        <div class="properties-panel-container" >
          <v-toolbar dense height="40" flat class="modeler-toolbar elevation-1 ">
            {{$t('bpmn.labels.Milestones')}}
          </v-toolbar>
          <v-list class="milestones-list" v-if="diagram">
            <v-list-item-group  v-for="group in groups" :key="group.name" >
              <v-subheader>{{  group.name | formatDate }}</v-subheader>
              <v-list-item class="row d-flex ma-1" :class="{'v-list-item--active ': item.versionId == version.versionId || version.id}"
                v-for="item in versions"
                :key="item.versionId"
                @click="changeVersion(item)">
                <v-list-item-avatar class="ma-0">
                  <v-avatar color="blue-grey lighten-1" :title="item.creatorName"> {{item.creatorName | formatAvatar}}</v-avatar>
                </v-list-item-avatar>
                <v-list-item-content style="text-align: start" class="px-2 py-2">
                  <v-list-item-title>{{item.name == diagram.name ? $t('bpmn.labels.LatestVersion') : item.name}}</v-list-item-title>
                  <v-list-item-subtitle>{{item.creationTime | formatTime }}</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action class="ma-0" v-if="item.name != diagram.name">
                  <bpmn-contex-menu :item="item" :milestones="true"
                    @edit="editItem" 
                    @remove="removeItem"
                    @compare="compare"
                    offset>
                  <template #activator="{ open }">
                    <v-btn icon class="options"   v-on="open">
                      <v-icon size="20">mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>
                </bpmn-contex-menu>
                </v-list-item-action>
              </v-list-item>
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
      versions: [],
      version: {},
      groups: []
    };
  },
  props: {
    activeItem: {
      required: true
    },
  },

  filters: {
    formatDate(value) {
      if (value) {
        let spliter = localStorage.language == 'uk' ? ' о' : localStorage.language == 'ru' ? ',' : 'at'
        return moment(value).calendar(null, {
          sameElse: 'DD MMMM YYYY'
        }).split(spliter)[0];
      }
    },
    formatTime(value) {
      if (value) {
        return moment(value).format('HH:mm');
      }
    },
    formatAvatar(value) {
      return value.length > 4 ? value.split(' ').map( el => el.slice(0,1)).join('') : value;
    }
  },

  computed: {
    diagram() {
      const activeItem = this.$store.state.bpmn.activeItem || this.$store.getters['bpmn/getItemById'](this.$route.params.id);
      if (activeItem && activeItem instanceof Diagram) {
        // this.loadUsers();
        return activeItem;
      }
      return null;
    },
    type() {
      if (!this.diagram) { return; }
      this.getVersions()
      return this.diagram.type;
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
  },
  methods: {
    onSplitDragEnd(size) {
      this.splitSize = 100 - Number.parseInt(size);
    },
    async findUser(userId) {
      let users = await this.$store.dispatch('bpmn/queryUsers');
      if (users.length == 0 || !users) {
        return userId;
      }
      let user = users.find( user => user.id == userId ),
        result = user ? user.name : userId;
      return result;
    },
    compare(itemId1, itemId2) {
      this.$router.push({name: 'compare', params: {id: itemId1}, query: {id2: itemId2} });
    },
    async getVersions() {
      if (!this.diagram || this.versions.length > 0) { return; }
      let versions = await this.$store.dispatch('bpmn/getVersionsForDiagram', this.diagram.id),
      groups = []
      if(versions.length == 0) {
        versions = [this.diagram]
          this.diagram.creatorName = await this.findUser(this.diagram.ownerId),
          this.diagram.creationTime = new Date()
      }
      versions.forEach( item => {
        let key = groups.find( el => el.name == item.creationTime)
        if(!key) {
          groups.push({
            name: item.creationTime,
            items: [item]
          })
        } else {
          key.items.push(item)
        }
      })
      this.groups = groups
      this.versions = versions
      this.changeVersion(versions[0])
    },
    async createVersion(item) {
      await this.$store.dispatch('bpmn/createDiagramVersion', item.id || item)
    },
    changeVersion(val) {
      if(val.versionId == this.$route.query.version || this.version.versionId == val.versionId) {
        this.version = val
        return 
      }
      this.version = val
      this.$router.replace({name: 'milestones', params: {id: this.diagram.id}, query: {version: val.versionId }})
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