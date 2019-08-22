<template>
  <v-flex xs12 class="empty-state-block">
    <empty-state-img class="empty-state-image"></empty-state-img>
    <span class="title grey--text font-weight-thin pa-2">
      <slot>{{ $t('sm.messages.noData') }}</slot>
    </span>
  </v-flex>
</template>

<script>
import emptyStateImg from './empty-grid-state.svg'

export default {
  name: 'sm-empty-state',
  components: {
    emptyStateImg
  }
}
</script>

<style scoped>
  .empty-state-block {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 50vh;
  }

  .empty-state-image {
    width: 200px;
  }

  /* SVG image colors */
  .empty-state-image .c {
    fill: #f1f1f1;
  }

  .empty-state-image .d {
    fill: #c5c5c5;
  }

  .empty-state-image .e {
    fill: #efefef;
  }
</style>
