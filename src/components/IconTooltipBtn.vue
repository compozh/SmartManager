<template>
  <v-tooltip :right="tooltipPosition === 'right'"
             :left="tooltipPosition === 'left'"
             :top="tooltipPosition === 'top'"
             :bottom="tooltipPosition === 'bottom'">
    <template #activator="{ on }">
      <v-btn v-on="on"
             :class="btnClass"
             :color="btnColor"
             :style="btnStyle"
             @click="btnClick"
             tabindex="-1"
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
    btnClass: String,
    btnColor: {
      type: String,
      default: 'grey'
    },
    btnStyle: String,
    btnClick: Function,
    icon: String,
    iconType: String,
    iconSize: {
      type: String,
      default: '2x'
    }
  }
}
</script>
