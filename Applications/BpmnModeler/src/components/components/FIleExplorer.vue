<template>
  <v-card class="file-explorer">
    <v-card-title class="py-1 px-3 elevation-1">
      <v-btn icon @click="changeFolder(choosedFolder.parentId)" v-if="choosedFolder.id">
        <v-icon size="17">mdi-arrow-left</v-icon>
      </v-btn>
      <v-col class="title px-1 py-2">{{ choosedFolder.name}}</v-col>
      <v-btn icon @click="closeExpl" class="ml-auto">
        <v-icon size="20">mdi-close</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text class="px-0 elevation-1">
      <v-list>
        <v-list-item class="px-3" dense :key="index"
          v-for="(elem, index) in choosedFolder.items">
          <v-list-item-content >
            <v-list-item-title :title="elem.name">
              <bpmn-tree-icon :node="elem"></bpmn-tree-icon>
              {{ elem.name }}
            </v-list-item-title>
          </v-list-item-content>
          <v-list-item-action class="ma-0" @click="changeFolder(elem)" v-if="elem.isFolder">
            <v-btn icon><v-icon >mdi-chevron-right</v-icon></v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-card-text>
    <v-card-actions class="py-1 px-3">
      <v-btn icon @click="addFolder" class="mr-auto" :title="canEdit(choosedFolder) ? $t('bpmn.labels.CreateFolder') : $t('bpmn.labels.CannotCreateFolder')"
        :disabled="!canEdit(choosedFolder)">
        <v-icon size="20">mdi-folder-plus</v-icon>
      </v-btn>
      <v-btn class="add-btn px-2" :loading="loading" @click="mode == 'move' ? moveHere(choosedFolder) : copyHere(choosedFolder)"
        :disabled="disable" :title="title">
        <v-icon size="20" class="mr-1">mdi-folder-move</v-icon>
        {{ mode == 'move' ?  $t('bpmn.buttons.MoveHere') : $t('bpmn.buttons.Copy') }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { formMixin } from '../mixins';
import * as Models from '../../api/models';
export default {
  name: 'file-explorer',
  mixins: [ formMixin ],
  data() {
    return {
      choosedFolder: '',
      loading: false,
      title: '',
      disable: false
    };
  },
  props: {
    explorer: Boolean,
    itemId: String,
    chosen: Array,
    mode: String
  },
  created() {
    this.changeFolder(this.itemId);
  },
  beforeDestroy() {
    this.closeExpl();
  },
  methods: {
    changeFolder(value) {
      if (!value) {
        this.choosedFolder = {
          name: this.$t('bpmn.labels.Projects'),
          items: this.items
        };
      } else if (!value.id) {
        let elem = this.$store.getters['bpmn/getItemById'](value);
        this.choosedFolder = elem.item; 
      } else {
        this.choosedFolder = value;
      }
      if ( this.mode == 'move') {
        this.disable =  this.choosedFolder.id == this.itemId || !this.canEdit(this.choosedFolder);
        this.title = this.disable ?  this.$t('bpmn.labels.AlreadyIn') : this.$t('bpmn.buttons.MoveHere');
      } else {
        this.disable = this.choosedFolder.id == null ||  !this.canEdit(this.choosedFolder);
        this.title = this.disable ?  this.$t('bpmn.labels.CannotCopy') : this.$t('bpmn.buttons.Copy');
      }

    },
    async moveHere(dropItem) {
      this.loading = true;
      let success;
      let processArray =  async (array) => {
        const promises = array.map(async draggingItem => {
          return await this.$store.dispatch('bpmn/itemDropped', { draggingItem, dropItem });
        });
        success =  await Promise.all(promises);
        success = success.every( el => el);
        if (success) {
          this.choose = [];
          await this.$store.dispatch('bpmn/resetCache');
          await this.$store.dispatch('bpmn/loadItems');
          this.closeExpl();
        } else {
          Notification.error(this.$t('bpmn.errors.CantDrop'));
        }
      };
      await processArray(this.choose);
      
      this.loading = false;
    },
    copyHere(parent) {
      let items = [];
      this.choose.forEach(el => {
        items.push(Object.assign({}, el));
      });
      items = items.map( it => {
        it.name = it.name + this.$t('bpmn.labels.Copy');
        it.parentId = parent.id;
        return it;
      });
      this.copyItem(items);
    },
    closeExpl() {
      this.show = false;
      this.changeFolder(this.itemId);
    },
    addFolder() {
      this.createItem(this.choosedFolder, 'folder');
    },
    canEdit(item) {
      if (!item.rights) { return true; }
      return item.hasRight(Models.AccessRights.Write);
    },
  },
  computed: {
    items() {
      return this.$store.state.bpmn.items;
    },
    choose: {
      get() {
        return this.chosen;
      },
      set(value) {
        this.$emit('update:chosen',value);        
      }
    },
    show: {
      get() {
        return this.explorer;
      },
      set(value) {
        this.$emit('update:explorer',value);        
      }
    }
  },
  watch: {
    items(val) {
      this.changeFolder(this.$route.params.id);
    },
    '$route'() {
      this.changeFolder(this.$route.params.id);
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