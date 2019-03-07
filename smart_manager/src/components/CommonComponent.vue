<template >
  <component v-if="component!=undefined" :is="component.name" v-bind="component.props">
    <!-- Slots -->
    <template v-slot:[slotGroup.key] v-for="slotGroup in slotGroups">
      <template v-for="subcontent in slotGroup.components">
        <common-component v-if="subcontent.type == 'component'" :component="subcontent.value"></common-component>
        <template v-else>{{subcontent.value}}</template>
      </template>
    </template>
    
    <template v-for="subcontent in defaultSlotGroup">
      <common-component v-if="subcontent.type == 'component'" :component="subcontent.value"></common-component>
      <template v-else>{{subcontent.value}}</template>
    </template>
  </component>
</template>
<script>
// @ is an alias to /src

import _ from "lodash";
import { debug, debuglog } from "util";

export default {
  name: "common-component",
  data() {
    return {};
  },
  methods: {
   
  },
  computed: {
    slotGroups() {
      var groups = _.groupBy(this.component.content, el => {
        return el.slot || "";
      });
      var a = _.keys(groups).map(el => ({ key: el, components: groups[el] }));
       console.log(a)
      return _.filter(a, el => !!el.key);
    },
    defaultSlotGroup(){
      return _.filter(this.component.content, el => !el.slot)
    }
  },
  props: ["component"]
};
</script>
