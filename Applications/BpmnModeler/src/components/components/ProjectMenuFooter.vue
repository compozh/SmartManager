<template>
   <v-footer app color="white"
      height="55px"
      v-if="chosen.length > 0">
      <div>{{chosen.length}}  {{ $t('bpmn.labels.Selected') }}</div>
      <v-col class="pa-0">
        <v-menu offset-y
          :close-on-click="false"
          :close-on-content-click="false">
          <template v-slot:activator="{ on }">
            <v-btn text class="menu-btn" v-on="on">
              <v-icon size="20">mdi-folder-move</v-icon>
              {{ $t('bpmn.buttons.Move') }}
            </v-btn>
          </template>
          <v-card class="file-explorer">
            <v-card-title>
              <v-btn icon @click="chooseFolder(choosedFolder.parentId)">
                <v-icon size="17">mdi-arrow-left</v-icon>
              </v-btn>
              {{ choosedFolder.name ? choosedFolder.name : this.$t('bpmn.labels.Projects')}}
            </v-card-title>
            <v-card-text>
              <v-list>
                <v-list-item
                  v-for="(item, index) in item.items.filter(it => it.isFolder)"
                  :key="index"
                  
                >
                  <v-list-item-title>{{ item.name }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-card-text>
          
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
      choosedFolder: ''
    };
  },
  props: {
    item: Object,
    chosen: Array
  },
  mounted() {
    this.chooseFolder(this.$route.params.id)
    
  },
  methods: {
    chooseFolder(value) {
      console.log(this.choosedFolder)
      if(!value) {
        this.choosedFolder = ''
      } else if(!value.id) {
        let elem = this.$store.getters['bpmn/getItemById'](value)
        this.choosedFolder = elem.item 
      } else {
        this.choosedFolder = value
      }
      
      // console.log(res)
      // return res
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
};
</script>
<style lang="scss" scoped>
.file-explorer {
  width: 400px;
}
</style>