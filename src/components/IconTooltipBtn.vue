<template>
  <v-tooltip :right="tooltipPosition === 'right'"
             :left="tooltipPosition === 'left'"
             :top="tooltipPosition === 'top'"
             :bottom="tooltipPosition === 'bottom'">
    <template v-slot:activator="{ on }">
      <v-btn v-on="on"
             :class="btnClass"
             :color="btnColor"
             :style="btnStyle"
             @click="btnClick"
             text fab x-small dark depressed>
          <fa-icon :icon="icon" :type="iconType" :size="iconSize"/>
      </v-btn>
    </template>
    <span>
      <slot></slot>
    </span>
  </v-tooltip>
</template>

<script>
export default {
  name: 'IconTooltipBtn',
  props: {
    tooltipPosition: {
      type: String,
      default: () => 'right'
    },
    tooltipText: {
      type: String
    },
    btnClass: String,
    btnColor: String,
    btnStyle: String,
    btnClick: Function,
    icon: String,
    iconType: String,
    iconSize: String
  }
}
</script>
