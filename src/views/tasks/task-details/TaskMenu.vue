<template>
  <v-menu close-on-click
          close-on-content-click
          offset-y
          transition="scroll-y-transition">
    <template v-slot:activator="{ on: menu }">
      <v-tooltip right>
        <template v-slot:activator="{ on: tooltip }">
          <v-btn v-on="{ ...tooltip, ...menu }"
                 small depressed
                 class="position-absolute"
                 style="position: absolute; top: 2em; right: 1.6em;"
                 min-width="20"
                 :disabled="!menuItems.length">
            <fa-icon icon="ellipsis-v" size="lg"/>
          </v-btn>
        </template>
        <span>{{ $t('buttons.more') }}</span>
      </v-tooltip>
    </template>
    <v-list dense nav>
      <v-list-item v-for="(item, i) in menuItems"
                   :key="i"
                   @click="item.action">
        <v-list-item-icon class="ma-0 mr-2 align-self-center align-center">
          <fa-icon :icon="item.icon" :class="item.color + '--text'"/>
        </v-list-item-icon>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
import { tasks } from '@/mixins/units'

export default {
  name: 'TaskMenu',
  mixins: [tasks],
  computed: {
    menuItems () {
      const items = []
      if (!this.externalTaskCamunda) {
        items.push({
          title: this.$t('buttons.cancelOff'),
          action: () => this.$emit('changeStatus', '-'),
          icon: 'horizontal-rule',
          color: 'deep-orange'
        })
        if (this.taskType !== 'WORKFLOW') {
          items.push({
            title: this.$t('buttons.delete'),
            action: () => this.$emit('taskDelete'),
            icon: 'trash',
            color: 'red'
          })
        }
      }
      return items
    }
  }
}
</script>

<style scoped>

</style>
