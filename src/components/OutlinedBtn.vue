<template>
  <v-btn outlined
         :x-small="xSmall && !small"
         :small="small"
         :color="color"
         :disabled="disabled"
         @click="handler">
    <fa-icon v-if="icon" :icon="icon" size="lg" :class="`${mr}-1`"/>
    <slot>Button</slot>
  </v-btn>
</template>

<script>
export default {
  name: 'OutlinedBtn',
  props: {
    xSmall: {
      type: Boolean,
      default: true
    },
    small: {
      type: Boolean,
      default: false
    },
    color: {
      type: String,
      default: 'primary'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    icon: String,
    handler: {
      type: Function,
      default: () => {}
    }
  }
}
</script>

<style scoped>

  .v-btn {
    min-height: 25px;
    min-width: 50px;
  }

  .v-btn >>> span {
    height: 25px;
    width: 100%;
  }

  .v-btn >>> span > span {
    display: flex;
    align-items: center;
    padding-top: 0.25em;
  }

</style>
