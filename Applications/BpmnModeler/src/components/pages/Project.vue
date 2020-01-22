<template>
  <v-container align-center  column>
    <v-row class="layout-title">
      <v-icon class="pr-2">folder</v-icon>
      <h1>{{item ? item.name : 'folder'}}</h1>
    </v-row>
    <v-divider />
    <v-row class="layout diagrams" v-if="children && children.length > 0">
      <v-col cols=4 v-for="item in children" :key="item.id">
        <item-card :item="item"
            @deployItem="deployItem"
            @exportItem="exportItem"/>
      </v-col>
    </v-row>
    <v-row v-else>
      no items
    </v-row>
  </v-container>
</template>
<script>
import BpmnTreeIcon from '../functional/BpmnTreeIcon'
export default {
  name: 'bpmn-project',
  
  components: {  BpmnTreeIcon},
  props: {
    // items: Array,
  },
  methods: {
    exportItem() {
      this.$emit('exportItem')
    },
    deployItem(){
      this.$emit('deployItem')
    },
  },
  computed: {
    item() {      
      let itemId = this.$route.params.id
      const { item, index } = this.$store.getters['bpmn/getItemById'](itemId)
      return item
    },
    children() {
      return this.item.items
    }
  },
};
</script>
<style lang="scss" scoped>
.layout-title {
  width: 100%;
  padding: 25px;
  display: flex;
  align-items: center;

} 
 h1{

    color: #535353;
    font-size: 22px;
    font-weight: 700;
    vertical-align: bottom;
  }
  h2{
    margin-left: 30px;
    color: #7d7d7d;
    font-size: 13px;
    font-weight: 400;
    line-height: 1.2;
  }

.item-cards {
  h1 {
    text-align: start;
    height: 32px;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
.projects-table {
  width: 100%;
  margin: 20px 10px;
  padding: 10px;
}
</style>
