<template>
   <v-footer app color="white" elevation="2"
      height="55px"
      v-if="choose.length > 0">
      <div>{{choose.length}}  {{ $t('bpmn.labels.Selected') }}</div>
      <v-col class="pa-0">
        <v-menu offset-y top
          v-model="moveExplorer"
          :close-on-click="false"
          :close-on-content-click="false">
          <template v-slot:activator="{ on }">
            <v-btn text class="menu-btn" v-on="on" :disabled="!canEdit()" :title="canEdit() ?  $t('bpmn.buttons.Move') : $t('bpmn.errors.Er403')">
              <v-icon size="20">mdi-folder-move</v-icon>
              {{ $t('bpmn.buttons.Move') }}
            </v-btn>
          </template>
          <file-explorer :itemId="item.id" :chosen.sync="choose" :explorer.sync="moveExplorer" mode="move" />
        </v-menu>
        
        
        <v-menu offset-y top
          v-model="copyExplorer"
          :close-on-click="false"
          :close-on-content-click="false">
          <template v-slot:activator="{ on }">
            <v-btn text class="menu-btn "  v-on="on"  :disabled="!canEdit()" :title="canEdit() ?  $t('bpmn.buttons.Copy') : $t('bpmn.errors.Er403')">
              <v-icon size="20">mdi-content-copy</v-icon>
              {{ $t('bpmn.buttons.Copy') }}
            </v-btn>
          </template>
          <file-explorer :itemId="item.id" :chosen.sync="choose" :explorer.sync="copyExplorer" mode="copy" />
        </v-menu>
        <v-btn text class="menu-btn " @click="removeItem(choose)" :disabled="!canEdit()" :title="canEdit() ?  $t('bpmn.buttons.Delete') : $t('bpmn.errors.Er403')">
          <v-icon size="20">mdi-delete</v-icon>
          {{ $t('bpmn.buttons.Delete') }}
        </v-btn>
      </v-col>
      <v-btn icon @click="choose = []"><v-icon>mdi-close</v-icon></v-btn>
    </v-footer>
</template>

<script>
import { formMixin } from '../mixins';
import * as Models from '../../api/models';
export default {
  name: 'folder-menu-footer',
  mixins: [ formMixin ],
  data() {
    return {
      moveExplorer: false,
      copyExplorer: false,
    };
  },
  props: {
    item: Object,
    chosen: Array
  },
  methods: {
    canEdit() {
      return this.item.hasRight(Models.AccessRights.Write);
    },
  },
  computed: {
    choose: {
      get() {
        return this.chosen;
      },
      set(value) {
        this.$emit('update:chosen',value);        
      }
    }
  },
  watch: {
    '$route'() {
      this.choose = [];
      
    },
  }
};
</script>
<style lang="scss" scoped>

.file-explorer {
  width: 400px;

  .v-card__text {
    height: 320px;
    overflow: auto;
    &::-webkit-scrollbar {width: 8px;}
    &::-webkit-scrollbar-track-piece { background-color: grey;}
    &::-webkit-scrollbar-thumb { height: 30px; background-color: #2b343b;}

    .v-list-item {
      max-height: 42px;
      cursor: default;
    }
  }
  .v-card__title {

    position: sticky;
    .title {
      text-align: start;
      overflow: hidden;
      cursor: default;
      height: 46px;
    }
  }
  .v-card__title, .v-card__actions, .v-list-item:hover {
    background-color: rgba(226, 223, 223, 0.658);
  }
}
.add-btn {
  font-size: 11px;
  color: white;
  background-color: #1976d2 !important;
  height: 30px !important;
}

.v-btn--disabled {
    pointer-events: auto !important;
} 
</style>