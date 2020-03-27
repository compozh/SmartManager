<template>
  <v-dialog v-if="show" v-model="show" max-width="80%" ref="dialog" content-class="selection-assistant">
    <v-card>
        <v-tabs vertical>
          <v-tab v-for="category in caltegories" :key="category.title">
            {{category.title}}
          </v-tab>
          <v-tab-item class="category-item md-scroll" v-for="category in caltegories" :key="category.title">
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
      caltegories: {},
      show: false,
      search: ''
    };
  },
  mounted() {
    eventBus.$on(events.modeler.showSelectionAssistant, this.onShowSelectionAssistant);
  },
  beforeDestroy() {
    eventBus.$off(events.modeler.showSelectionAssistant, this.onShowSelectionAssistant);
  },
  methods: {
    onShowSelectionAssistant(items, callback) {
      this.caltegories = {};
      this.callback = callback;
      for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (!item.type) {
          if (!this.caltegories['default']) {
            this.caltegories['default'] = {
              title: item.type,
              items: [item]
            };
          } else {
            this.caltegories.default.items.push(item);
          }
        } else {
          if (!this.caltegories[item.type]) {
            this.caltegories[item.type] = {
              title: item.type,
              items: [item]
            };
          } else {
            this.caltegories[item.type].items.push(item);
          }
        }
      }
      this.show = true;
    },
    select(item) {
      if (this.callback) {
        this.callback(item);
        this.callback = null;
      }
      this.show = false;
    },
    showOverview(item) {
      if (!item.unformio) {
        return;
      }
      this.show = false;
      eventBus.$emit(events.formio.showFormOverview, item.unformio);
    }
  }
};
</script>
<style>
  .selection-assistant {
    overflow: inherit;
  }
  .category-item {
    height: 90vh;
    overflow-y: auto;
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
