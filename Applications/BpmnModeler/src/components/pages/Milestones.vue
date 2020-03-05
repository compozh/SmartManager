<template>
	<v-container class="column pa-0 fill-height milistones-component" fluid >

    <Split @onDragEnd="onSplitDragEnd" :gutterSize="12">
      <SplitArea :size="100 - splitSize" class="diagram-section">
          <v-row class="fill-height" v-if="loading" justify="center" align="center">
            <v-progress-circular :size="70" :width="7" color="primary" indeterminate />
          </v-row>
        <copmpare-modeler :fullScreenVisible="true" :diagram="diagram" :version="version" :type="type" />
      </SplitArea>
      <SplitArea :size="splitSize" :minSize="0" class="properties-panel-section">
        <div class="properties-panel-container" >
          <v-toolbar dense height="40" flat class="modeler-toolbar elevation-1 ">
            {{$t('bpmn.labels.Milestones')}}
          </v-toolbar>
          <v-list class="milestones-list md-scroll" v-if="diagram" >
            <div  v-for="group in groups" :key="group.name" class="" >
              <v-subheader>{{  group.name | formatDate }}</v-subheader>
              <v-list-item class="row d-flex ma-1" :class="{'v-list-item--active ': item.versionId == $route.query.version }"
                v-for="item in group.items" selectable
                :key="item.versionId"
                @click="changeVersion(item)">
                <v-list-item-avatar class="ma-0">
                  <v-avatar color="blue-grey lighten-1" :title="item.creatorName || item.ownerName">
                    <img v-if="userInfo && userInfo.userPhoto" :src="userInfo && userInfo.userPhoto ? userInfo.userPhoto : ''">
                    {{!userInfo || !userInfo.userPhoto ? formatAvatar(item) : ''}}
                    </v-avatar>
                </v-list-item-avatar>
                <v-list-item-content style="text-align: start" class="px-2 py-2">
                  <v-list-item-title>{{item.name == diagram.name ? $t('bpmn.labels.LatestVersion') : item.name}}</v-list-item-title>
                  <v-list-item-subtitle style="white-space: normal;">{{item.creationTime | formatTime }}{{item.creatorName | formatCreator}}</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action class="ma-0" v-if="item.name != diagram.name">
                  <bpmn-contex-menu :item="item" :milestones="true"
                    @edit="editItem"
                    @remove="removeItem"
                    @compare="compareItems"
                    @copy="copyItem"
                    :diagram="diagram"
                    :version="version"
                    offset>
                  <template #activator="{ open }">
                    <v-btn icon class="options"   v-on="open">
                      <v-icon size="20">mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>
                </bpmn-contex-menu>
                </v-list-item-action>
              </v-list-item>
            </div>
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
      groups: [],
      userInfo: this.$store.state.auth.user || null
    };
  },

  filters: {
    formatDate(value) {
      if (value) {
        let spliter = localStorage.language == 'uk' ? ' о' : localStorage.language == 'ru' ? ',' : 'at';
        return moment(value).calendar(null, {
          sameElse: 'DD MMMM YYYY'
        }).split(spliter)[0];
      }
    },
    formatTime(value) {
      if (value) {
        return moment(value).format('HH:mm') + ' ';
      }
    },
    formatCreator(value) {
      return ' ' + value;
    }
  },
  computed: {
    diagram() {
      const activeItem = this.$store.state.bpmn.activeItem || this.$store.getters['bpmn/getItemById'](this.$route.params.id);
      if (activeItem && activeItem instanceof Diagram) {
        return activeItem;
      }
      return null;
    },
    type() {
      if (!this.diagram) { return; }
      this.getVersions();
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
  },
  methods: {
    onSplitDragEnd(size) {
      this.splitSize = 100 - Number.parseInt(size);
    },
    compareItems(itemId1, itemId2) {
      this.$router.push({name: 'compare', params: {id: this.diagram.id}, query: {left: itemId1, right: itemId2} });
    },
    async getVersions() {
      if (!this.diagram ) { return; }
      this.loading = true;
      let versions = await this.$store.dispatch('bpmn/getVersionsForDiagram', this.diagram.id),
        groups = [];
      if (!versions || versions.length == 0) {
        versions = [this.diagram];
        let date = new Date();
        this.diagram.creationTime = moment(date).format();
      }

      versions.sort( (a, b) =>  {
        let diff = moment(b.creationTime).toDate().getTime() - moment(a.creationTime).toDate().getTime();
        return diff == 0 ? -1 : diff;
      }).forEach( item => {
        let key = groups.find( el => el.name == item.creationTime.slice(0,10));
        if (!key) {
          groups.push({
            name: item.creationTime.slice(0,10),
            items: [item]
          });
        } else {
          key.items.push(item);
        }
      });
      groups = groups.sort( (a, b) =>  {
        return moment(b.name).toDate().getTime() - moment(a.name).toDate().getTime();
      });
      this.groups = groups;
      this.versions = versions;
      this.loading = false;
      this.changeVersion(this.versions.find( el => el.versionId == this.$route.query.version) || groups[0].items[0]);
    },
    changeVersion(val) {
      if (val.versionId == this.$route.query.version || this.version.versionId == val.versionId ) {
        this.version = val;
        return;
      } else {
        this.version = val;
        this.$router.replace({name: 'milestones', params: {id: this.diagram.id}, query: {version: val.versionId }});
      }

    },
    formatAvatar(value) {
      return value.creatorName.length > 4 ? value.creatorName.split(' ').map( el => el.slice(0,1)).join('') : value.creatorName;
    },
  },
};
</script>
<style lang="scss" scoped>
.milistones-component {
  max-height: calc(100vh - 50px)
}
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
  height: calc(100% - 40px) !important;
  overflow-y: auto;
  .v-list-item__title {
    font-size: 13px;
  }
  .v-list-item__subtitle {
    font-size: 12px;
  }
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
