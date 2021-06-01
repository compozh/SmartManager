<template>
  <v-menu close-on-click
          close-on-content-click
          offset-y
          transition="scroll-y-transition">
    <template #activator="{ on: menu }">
      <v-tooltip top>
        <template #activator="{ on: tooltip }">
          <v-btn v-on="{ ...tooltip, ...menu }"
                 small depressed
                 style="position: absolute; top: 2em;"
                 :style="`${isRight}: 1.6em`"
                 min-width="20"
                 :disabled="!menuItems.length || taskChanged">
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
        <v-list-item-icon :class="`ma-0 ${mr}-2 align-self-center align-center`">
          <fa-icon :icon="item.icon" :class="item.color + '--text'"/>
        </v-list-item-icon>
        <v-list-item-title>{{ item.title }}</v-list-item-title>
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
          title: this.$t('buttons.cancel'),
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
