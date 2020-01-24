<template>

    <v-breadcrumbs class="pa-0" :items="elements">
      <template v-slot:divider>
        <v-icon class="pt-2" size="22">mdi-chevron-right</v-icon>
      </template>
      <template v-slot:item="crumbs">
        <router-link class="crumbs row pt-4 px-0" :to="routeTo(crumbs.item)" :key="crumbs.item.name">
          <span v-if="!crumbs.item.name">{{ crumbs.item }}</span>
          <div v-if="crumbs.item.name" :title="crumbs.item.name">{{ crumbs.item.name }}</div>
          <bpmn-contex-menu :item="item()" v-if="crumbs.item.id == $route.params.id && item()"
            @edit="editItem" :crumb="true"
            @remove="removeItem" 
            @export="exportItem"
            offset>
            <template #activator="{ open }">
              <v-btn icon class="text-left"  v-on="open">
                <v-icon size="20">mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
          </bpmn-contex-menu>
        </router-link>          
      </template>
    </v-breadcrumbs>
</template>

<script>
import { formMixin, importMixin, propertiesPanelEventsHandlersMixin } from '../mixins';
import { events } from '../../constants';
import { eventBus } from '../../main';
import treeSearch from '../../api/treeSearch'

export default {
  name: 'breadcrumbs',
  mixins: [ formMixin, importMixin, propertiesPanelEventsHandlersMixin ],
  computed: {
    items() {
      this.item()
      return this.$store.state.bpmn.items;
    },

    elements() {
      let item = this.item(),
        elements = [this.$t('bpmn.labels.Home')]

      if (item && item.parentId) {
        let el = treeSearch(this.items, e => {
          return e.isFolder && e.items.find(i => { 
            return  i.id === item.id 
          })
        })
        let parentId = el[0].item.id, parent
        while (parentId) {
          parent  = treeSearch(this.items, e => e.isFolder && e.items.find(i => i.id === parentId))
          if (parent[0]) {
            parentId = parent[0].item.id
            elements.push(parent[0].item)
          } else {
            parentId = false
            elements.push(el[0].item)
          }
        }
      }
      if (item) {
        elements.push(item)
      }
      return elements   
    },
  },
  methods: {
    
    exportItem(item, type) {
      eventBus.$emit(events.modeler.export, type);
    },
    routeTo(item) {
      let to = item.id ?
          item.isFolder ? 'Project' :
            item.type == 'BPMN'  ? 'Process'
              : 'Decision'
          : 'Main',
        id = item.id ? item.id : ''
      return id ? {name: to, params: {id}} : {name: to}
    },
    item() { 
      let itemId = this.$route.params.id
      if (!itemId) { return false }
      const { item, index } = this.$store.getters['bpmn/getItemById'](itemId)
      return item
    },
    
  }
}
</script>

<style scoped>
a{
  text-decoration: none;
}
.crumbs{
  color: grey;
  font-size: 17px;
  height: 48px;
}
.crumbs div {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.text-left {
  padding-bottom: 5px;
  height: 30px !important;
  width: 30px !important;
}
</style>
