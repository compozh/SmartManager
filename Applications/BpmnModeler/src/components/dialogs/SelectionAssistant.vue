<template>
  <v-dialog v-if="show" v-model="show" width="80%" ref="dialog" content-class="selection-assistant">
    <v-card class="selection-assistant-card">
      <v-card-title class="py-2">
        <v-col class="title py-2">{{title}}</v-col>
        <v-text-field
          v-model="search"
          class="search-input"
          label="Search"
          @keyup.enter="filterItems"
          outlined
        ></v-text-field>
        <v-btn icon @click="closeAssistant" class="ml-auto">
          <v-icon size="20">mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-divider></v-divider>
        <v-tabs vertical hide-slider active-class="assistant-category-active">
          <v-tab v-for="category in categories" :key="category.title" class="assistant-category">
            {{category.title}}
          </v-tab>
          <v-tab-item class="category-item" v-for="category in categories" :key="category.title">
            <v-container fluid>
              <v-row dense>
                <v-col
                v-for="item in category.items" :key="item.name"
                  :cols="4"
                >
                  <v-card class='item-card'>
                    <v-card-title v-text="item.name" style="word-break: break-word;"></v-card-title>
                    <v-card-text v-if="item.type">
                      Category: {{item.type}}
                    </v-card-text>
                    <v-card-actions class="item-card-actions">
                      <v-btn text @click="select(item)">{{ $t('bpmn.buttons.Select') }}</v-btn>
                      <v-btn text @click="showOverview(item)">{{ $t('bpmn.buttons.Overview')}}</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-col>
              </v-row>
            </v-container>
          </v-tab-item>
        </v-tabs>
    </v-card>
  </v-dialog>
</template>
<script>
import { eventBus } from '../../main';
import { events } from '../../constants';

export default {
  name: 'selection-assistant',
  data() {
    return {
      categories: {},
      originalData: {},
      show: false,
      search: '',
      title: ''
    };
  },
  mounted() {
    eventBus.$on(events.modeler.showSelectionAssistant, this.onShowSelectionAssistant);
  },
  beforeDestroy() {
    eventBus.$off(events.modeler.showSelectionAssistant, this.onShowSelectionAssistant);
  },
  methods: {
    onShowSelectionAssistant(items, title, callback) {
      this.categories = {};
      this.callback = callback;
      this.title = title;
      for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (i <= 10) {
          item.type = 'test' + i
        }
        if (!item.type) {
          if (!this.categories['default']) {
            this.categories['default'] = {
              title: 'default',
              items: [item]
            };
          } else {
            this.categories.default.items.push(item);
          }
        } else {
          if (!this.categories[item.type]) {
            this.categories[item.type] = {
              title: item.type,
              items: [item]
            };
          } else {
            this.categories[item.type].items.push(item);
          }
        }
      }
      this.originalData = this.categories;
      this.show = true;
    },
    select(item) {
      if (this.callback) {
        this.callback(item);
        this.callback = null;
      }
      this.show = false;
    },
    closeAssistant() {
      this.show = false;
    },
    showOverview(item) {
      if (!item.unformio) {
        return;
      }
      this.show = false;
      eventBus.$emit(events.formio.showFormOverview, item.unformio);
    },
    filterItems() {
      var keys =  Object.keys(this.originalData),
        filteredCategories = {};
      for (var i = 0; i < keys.length; i++) {
        var category = this.originalData[keys[i]],
          newItems = category.items.filter(item => item.name.toLowerCase().includes(this.search.toLowerCase()) || item.type.toLowerCase().includes(this.search.toLowerCase()));
        if (newItems.length) {
          filteredCategories[keys[i]] = {
            title: keys[i],
            items: newItems
          };
        }
      }
      this.categories = filteredCategories;
    }
  }
};
</script>
<style lang="scss">
.selection-assistant{
    overflow: inherit;
    .title {
      text-align: left;
    }
    .search-input {
      height: 55px;
      max-width: 400px;
      margin: 0 20px;
    }
    .selection-assistant-cardtext {
      padding: 0 !important;
    }
    .v-tabs-bar {
      border-right: 1px solid #00000014;
    }
    .assistant-category {
      width: 200px;
    }

    .assistant-category {
      height: 100% !important;
    }
    .assistant-category-active {
      box-shadow: inset 0 0 3px 0px #0000006b;
    }
    .item-card {
      height: 200px;
      margin: 10px;
      text-align: start;
    }
    .item-card-actions {
      position: absolute;
      bottom: 0px;
      width: 100%;
    }

    .category-item {
      height: 80vh;
      overflow-y: auto;
    }

    .category-item::-webkit-scrollbar {
      background-color:#fff;
      width:16px;
      height: 16px
    }
    /* background of the scrollbar except button or resizer */
    .category-item::-webkit-scrollbar-track {
        background-color:#fff
    }
    .category-item::-webkit-scrollbar-track:hover {
        background-color:#fff
    }

    /* scrollbar itself */
    .category-item::-webkit-scrollbar-thumb {
        background-color:#babac0;
        border-radius:16px;
        border:5px solid #fff
    }
    .category-item::-webkit-scrollbar-thumb:hover {
        background-color:#a0a0a5;
        border:4px solid #f4f4f4
    }
    /* set button(top and bottom of the scrollbar) */
    .category-item::-webkit-scrollbar-button {display:none}


  }
</style>
