<template>
  <v-breadcrumbs class="pa-0" :items="elements">
    <template v-slot:divider>
      <v-icon style="padding-top: 2px" size="17">mdi-chevron-right</v-icon>
    </template>
    <template v-slot:item="crumbs">
      <div class="crumbs row px-2 pb-0" @click="routeTo(crumbs.item)" :key="crumbs.item.name">
        <div v-if="!crumbs.item.id" :title="crumbs.item.name || compare" >{{ crumbs.item.name || compare}}</div>
        <div v-if="crumbs.item.id" :title="crumbs.item.name" :class="{parent : crumbs.item.id != $route.params.id}" >
          {{ crumbs.item.name }}
        </div>
        <bpmn-contex-menu :item="item()"
          v-if="crumbs.item.id == $route.params.id && $route.name != 'milestones' && $route.name != 'compare'
          && (canEdit(item()) && canShare(item()) || !item().isFolder)"
          @edit="editItem" :crumb="true"
          @remove="removeItem"
          @export="exportItem"
          @copy="copyItem"
          offset>
          <template #activator="{ open }">
            <v-btn icon class="text-left"  v-on="open">
              <v-icon size="18">mdi-chevron-down</v-icon>
            </v-btn>
          </template>
        </bpmn-contex-menu>
      </div>
    </template>
  </v-breadcrumbs>
</template>

<script>
import { formMixin } from '../mixins';
import { events } from '../../constants';
import { eventBus } from '../../main';
import treeSearch from '../../api/treeSearch';
import * as Models from '../../api/models';

export default {
  name: 'breadcrumbs',
  mixins: [ formMixin ],
  data () {
    return {
      compare: ''
    };
  },
  props: {
    activeItem: {
      required: true
    },
  },
  computed: {
    items() {
      this.item();
      return this.$store.state.bpmn.items;
    },
    active: {
      get() {
        return this.activeItem;
      },
      set(value) {
        this.$emit('update:activeItem', value);
      }
    },
    elements() {
      let item = this.item(),
        elements = [];
      if (!item) {
        return elements;
      }
      var oneTierItems = this.flattenArr(this.items);
      elements.push(item);

      var findParent = function(item, items, elements) {
        if (item.parentId) {
          let parent = items.find(i => i.id === item.parentId);
          if (!parent) {
            return elements;
          }
          elements.unshift(parent);
          findParent(parent, items, elements);
        } else {
          return elements;
        }
      };
      findParent(item, oneTierItems, elements);
      return elements;
    },
  },
  methods: {
    flattenArr(items) {
      var result = [];
      result.push(...items);
      var flattenFn = function(items) {
        for (var i = 0; i < items.length; i++) {
          if (items[i].items && items[i].items.length) {
            flattenFn(items[i].items);
          }
          result.push(items[i]);
        }
      };
      flattenFn(items);
      return result;
    },
    canShare(item) {
      if (!item) { return false; }
      return item.hasRight(Models.AccessRights.Share);
    },
    canEdit(item) {
      if (!item) { return false; }
      return item.hasRight(Models.AccessRights.Write);
    },
    exportItem(item, type) {
      eventBus.$emit(events.modeler.export, type);
    },
    routeTo(item) {
      if (item.id) {
        this.active = item.id;
      } else if (item.routeName && item.routeName != this.$route.name) {
        this.$router.push({name: item.routeName, params: {id: this.$route.params.id} });
      } else {
        return;
      }
    },
    item() {
      let itemId = this.$route.params.id;
      if (!itemId) { return false; }
      const { item, index } = this.$store.getters['bpmn/getItemById'](itemId);
      return item;
    },
    async getVersions() {
      if (this.compare) { return; }
      let diagram = this.$store.getters['bpmn/getItemById'](this.$route.params.id).item;
      let versions = diagram ? await this.$store.dispatch('bpmn/getVersionsForDiagram',  diagram.id ) : [];
      let first = versions.find( el => el.versionId == this.$route.query.left) || this.$store.getters['bpmn/getItemById'](this.$route.query.left).item;
      let second = versions.find( el => el.versionId == this.$route.query.right) || this.$store.getters['bpmn/getItemById'](this.$route.query.right).item;
      if (!first && !second) {
        this.compare = '';
      } else {
        this.compare = `"${first.name}" / "${second.name}"`;
      }

    }
  },
  watch: {
    '$route'() {
      this.compare = '';
    },
  }
};
</script>

<style scoped lang="scss">
a{
  text-decoration: none;
}
.crumbs{
  color: grey;
  font-size: 15px;
  height: 48px;
  padding-top: 14px;
}
.crumbs div {
  cursor: pointer;
  max-width: 250px;
  min-width: 25px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.text-left {
  padding-bottom: 5px ;
  height: 25px !important;
  width: 25px !important;
}
.parent {
  color: #1976d2;
}
</style>
