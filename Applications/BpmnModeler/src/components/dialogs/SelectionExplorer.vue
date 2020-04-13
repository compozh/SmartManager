<template>
  <v-dialog v-if="show" v-model="show" max-width="1200" @keydown.enter="select()" ref="dialog">
    <div class="selection-explorer">
      <v-card class="choose-explorer">
        <v-card-title class="py-1 px-3 elevation-1">
          <v-btn icon @click="changeFolder(choosedFolder.parentId)" v-if="choosedFolder.id">
            <v-icon size="17">mdi-arrow-left</v-icon>
          </v-btn>
          <v-col class="title px-1 py-2">{{ choosedFolder.name}}</v-col>
          <v-btn icon @click="closeExpl" class="ml-auto">
            <v-icon size="20">mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="px-0 elevation-1 item">
          <v-list :width="!currentItem || currentItem.isFolder ? '100%' : '50%'">
            <span v-if="!choosedFolder.items">{{$t('bpmn.labels.NoDataText')}}</span>
            <v-list-item v-else class="px-3" dense :key="index"
              v-for="(elem, index) in choosedFolder.items"
              @click="selectItem(elem)"
              >
              <v-list-item-content>
                <v-list-item-title class="item-content" :title="elem.name">
                  <bpmn-tree-icon :node="elem"></bpmn-tree-icon>
                  <span class="item-name">{{ elem.name }}</span>
                  <v-btn color="primary" text small class="select-action" v-if="!elem.isFolder" @click="select(elem)">Выбрать</v-btn>
                </v-list-item-title>

              </v-list-item-content>
              <v-list-item-action class="ma-0" @click="changeFolder(elem)" v-if="elem.isFolder">
                <v-btn icon><v-icon >mdi-chevron-right</v-icon></v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list>
          <v-card v-model="currentItem" v-show="currentItem && !currentItem.isFolder" class="preview-content" :key="updatePreview" ref="fullScreenParent">
            <compare-modeler v-if="currentItem" :version="currentItem" :type="currentItem.type" :fullScreenVisible="false" :parentEl="this.$refs.fullScreenParent.$el" ></compare-modeler>
          </v-card>
        </v-card-text>

      </v-card>

    </div>
  </v-dialog>
</template>
<script>
import { eventBus } from '../../main';
import { events } from '../../constants';
import treeSearch from '../../api/treeSearch';
import { Folder } from '../../api/models';

export default {
  name: 'selection-explorer',
  data() {
    return {
      show: false,
      choosedFolder: '',
      loading: false,
      items: [],
      menu: false,
      updatePreview: 0,
      currentItem: null,
      availableItems: [],
      originalData: []
    };
  },
  mounted() {
    eventBus.$on(events.modeler.showSelectionExplorer, this.onShowSelectionExplorer);
  },
  beforeDestroy() {
    eventBus.$off(events.modeler.showSelectionExplorer, this.onShowSelectionExplorer);
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
        let [{ item = null, index = -1 } = {}] = treeSearch(this.items, (item) => item.id === value);
        this.choosedFolder = item;
      } else {
        this.choosedFolder = value;
      }
    },
    onShowSelectionExplorer(items, selectedItem, callback) {
      this.items = [];
      this.availableItems = [];
      this.originalData = items;
      var originalItems = this.$store.getters['bpmn/getItems'];
      for (var i = 0; i < items.length; i++) {
        var item = items[i],
          digramItem = this.$store.getters['bpmn/getItemById'](item.diagramId);
        if ( digramItem && digramItem.item ) {
          this.availableItems.push(digramItem.item);
        }
      }
      if (!this.availableItems || !this.availableItems.length) {
        return;
      }
      this.items = this.filterItems(this.availableItems, originalItems);

      if (selectedItem && selectedItem.id && selectedItem.diagramId) {
        let searchItem = treeSearch(this.items, (elem) => elem.id === selectedItem.diagramId),
          searchItemFolder = searchItem[0] && searchItem[0].item && searchItem[0].item.parentId ? searchItem[0].item.parentId : null;
        if (searchItemFolder) {
          this.changeFolder(searchItemFolder);
        }
      } else {
        this.changeFolder();
      }
      this.callback = callback;
      this.show = true;

    },
    filterItems(items, store) {
      var resStore = [];
      for (var i = 0; i < store.length; i++) {
        var storeItem = Object.assign({}, store[i]);
        storeItem.isFolder = store[i].isFolder;
        if (storeItem.isFolder) {
          storeItem.items = this.filterItems(items, storeItem.items);
          if (storeItem.items && storeItem.items.length) {
            storeItem = new Folder(storeItem);
            resStore.push(storeItem);
          }
        } else {
          for (var j = 0; j < items.length; j++) {
            if (items[j].id == storeItem.id) {
              resStore.push(items[j]);
            }
          }
        }
      }
      return resStore;
    },
    closeExpl() {
      this.show = false;
    },
    selectItem(item) {
      this.currentItem = item;
      this.updatePreview++;
    },
    select(item) {
      var originalItem = this.originalData.find(data => data.diagramId == item.id);
      if (this.callback && originalItem) {
        this.callback(originalItem);
        this.callback = null;
      }
      this.show = false;
    },
  }
};
</script>
<style lang="scss">
.selection-explorer {
  display: flex;
  width: 100%;
}
.choose-explorer {
  width: 100%;
  .v-card__text {
    height: 550px;
    .v-list {
      width: 50%;
      overflow: auto;
      &::-webkit-scrollbar {width: 8px;}
      &::-webkit-scrollbar-track-piece { background-color: grey;}
      &::-webkit-scrollbar-thumb { height: 30px; background-color: #2b343b;}

      .v-list-item {
        max-height: 42px;
        cursor: default;

      }
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
  .item {
    display: flex;
    height: 80vh;
    padding: 0;
    .item-content {
      display: flex;
      align-items: center;
      .item-name {
        font-size: 15px;
        margin-left: 5px;
        padding-top: 2px;
      }
    }
    .preview-content {
      width: 50%;
      margin: 2px 0;
      .item-card {
        display: flex;
        flex-direction: column;
        .v-card__text {
          min-height: calc(100% - 80px);
        }
        .v-card__title {
          max-height: 80px;
        }
        .tjs-container {
          top: 0;
        }
      }
    }
  }
}
.preview-content {
    width: 100%;
  }
.select-action {
  margin-left: auto;
}
</style>
