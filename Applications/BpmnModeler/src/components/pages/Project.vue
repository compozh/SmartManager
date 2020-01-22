<template>
  <v-container align-center  column>
    <v-row class="layout-title">
      <v-icon class="pr-2">folder</v-icon>
      <h1>{{item ? item.name : 'folder'}}</h1>
    </v-row>
    <v-divider />
  </v-container>
</template>
<script>
// import { eventBus } from '../main';
// import { events } from '../constants';

export default {
  name: 'bpmn-project',
  props: {
    items: Array,
  },
  methods: {
    // addProcess() {
    //   eventBus.$emit(events.modeler.createDiagram);
    // }
  },
  computed:{
    item() {
      return this.items.find( el => el.id == this.$router.currentRoute.params.id)
    }
  },
  mounted() {
    console.log(this)
  }
};
</script>
<style lang="scss" scoped>
.layout-title {
  width: 100%;
  padding: 25px;
  display: flex;
  align-items: center;
  h1{

    color: #535353;
    font-size: 22px;
    font-weight: 700;
    vertical-align: bottom;
  }
  h4{
    margin-left: 30px;
    color: #7d7d7d;
    font-size: 13px;
    font-weight: 400;
    line-height: 1.2;
  }
}
</style>
