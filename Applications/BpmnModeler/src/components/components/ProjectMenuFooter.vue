<template>
   <v-footer app color="white"
      height="55px"
      v-if="chosen.length > 0">
      <div>{{chosen.length}}  {{ $t('bpmn.labels.Selected') }}</div>
      <v-col class="pa-0">
        <v-menu offset-y top
          v-model="explorer"
          :close-on-content-click="false">
          <template v-slot:activator="{ on }">
            <v-btn text class="menu-btn" v-on="on">
              <v-icon size="20">mdi-folder-move</v-icon>
              {{ $t('bpmn.buttons.Move') }}
            </v-btn>
          </template>
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
            <v-card-text class="px-3 elevation-1">
              <v-list>
                <v-list-item class="px-0" dense :key="index"
                  v-for="(item, index) in choosedFolder.items.filter(it => it.isFolder)">
                  <v-list-item-content >
                    <v-list-item-title :title="item.name">{{ item.name }}</v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-action class="ma-0" @click="changeFolder(item)">
                    <v-btn icon><v-icon color="blue">mdi-chevron-right</v-icon></v-btn>
                  </v-list-item-action>
                </v-list-item>
              </v-list>
            </v-card-text>
            <v-card-actions class="py-1 px-3">
              <v-btn icon @click="addFolder" class="mr-auto">
                <v-icon size="20">mdi-folder-plus</v-icon>
              </v-btn>
              <v-btn text class="menu-btn">
                <v-icon size="20">mdi-folder-move</v-icon>
                {{ $t('bpmn.buttons.MoveHere') }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
        
        <v-btn text class="menu-btn "  @click="copyItem(chosen)">
          <v-icon size="20">mdi-content-copy</v-icon>
          {{ $t('bpmn.buttons.Copy') }}
        </v-btn>
        <v-btn text class="menu-btn " @click="removeItem(chosen)">
          <v-icon size="20">mdi-delete</v-icon>
          {{ $t('bpmn.buttons.Delete') }}
        </v-btn>
      </v-col>
      <v-btn icon @click="choose = []"><v-icon>mdi-close</v-icon></v-btn>
    </v-footer>
</template>

<script>
import { formMixin } from '../mixins';
export default {
  name: 'folder-menu-footer',
  mixins: [ formMixin ],
  data() {
    return {
      explorer: false,
      choosedFolder: this.item
    };
  },
  props: {
    item: Object,
    chosen: Array
  },
  mounted() {
    // this.changeFolder(this.$route.params.id)
  },
  methods: {
    changeFolder(value) {
      if(!value) {
        this.choosedFolder = {
          name: this.$t('bpmn.labels.Projects'),
          items: this.items
        }
      } else if(!value.id) {
        let elem = this.$store.getters['bpmn/getItemById'](value)
        this.choosedFolder = elem.item 
      } else {
        this.choosedFolder = value
      }
    },
    closeExpl() {
      this.explorer = false
      this.choosedFolder = this.item
    },
    addFolder() {
      this.createItem(this.choosedFolder, 'folder');
    },
  },
  computed: {
    items() {
      return this.$store.state.bpmn.items;
    },
    choose: {
      get() {
        return this.chosen
      },
      set(value) {
        this.$emit('update:chosen',value)        
      }
    }
  },
  watch: {
    items(val) {
      this.changeFolder(this.$route.params.id)
    }
  }
};
</script>
<style lang="scss" scoped>
.file-explorer {
  width: 400px;
  // height: 400px;
  .v-card__text {
    height: 320px;
    overflow: auto;
    &::-webkit-scrollbar {width: 8px;}
    &::-webkit-scrollbar-track-piece { background-color: grey;}
    &::-webkit-scrollbar-thumb { height: 30px; background-color: #2b343b;}

    .v-list-item {
      max-height: 42px;
    }
  }
  .v-card__title {
    position: sticky;
    background-color: white;
    .title {
      text-align: start;
      overflow: hidden;
      height: 46px;
    }
  }

}
</style>