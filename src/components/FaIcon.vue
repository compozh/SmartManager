<template>
  <font-awesome-icon :icon="[type, icon]"
                     :size="size"
                     :border="border"
                     :flip="flip"
                     :rotation="rotation"
                     :inverse="inverse"
                     :color="color"
                     :style="{'font-size': fixedSize + 'px'}"/>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

export default {
  props: {
    type: {
      type: String,
      required: false,
      default: 'far'
    },
    icon: {
      type: String,
      required: true,
      default: 'crutches'
    },
    size: {
      type: String,
      default: null,
      validator: function validator (value) {
        return ['lg', 'xs', 'sm', '1x', '2x', '3x', '4x', '5x', '6x', '7x', '8x', '9x', '10x'].indexOf(value) > -1
      }
    },
    fixedSize: {
      type: [String, Number]
    },
    border: {
      type: Boolean,
      default: false
    },
    flip: {
      type: String,
      default: null,
      validator: function validator (value) {
        return ['horizontal', 'vertical', 'both'].indexOf(value) > -1
      }
    },
    rotation: {
      type: [String, Number],
      default: null,
      validator: function validator (value) {
        return [90, 180, 270].indexOf(parseInt(value, 10)) > -1
      }
    },
    inverse: {
      type: Boolean,
      default: false
    },
    color: String
  },
  components: {
    FontAwesomeIcon
  },
  computed: {
    fontSize () {
      return {
        fontSize: this.sizePx + 'px !important;'
      }
    }
  }
}
</script>
