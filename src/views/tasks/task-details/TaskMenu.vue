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
                 style="position: absolute; top: 1.9em; right: 1.6em;"
                 min-width="20">
            <fa-icon icon="ellipsis-v" size="lg"/>
          </v-btn>
        </template>
        <span>{{ $t('buttons.more') }}</span>
      </v-tooltip>
    </template>
    <v-list dense nav>
      <v-list-item v-for="(item, i) in menuItems"
                   :key="i"
                   @click="$emit(item.action)">
        <v-list-item-icon class="ma-0 mr-2 align-self-center align-center">
          <fa-icon :icon="item.icon" :class="item.color + '--text'"/>
        </v-list-item-icon>
        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  name: 'TaskMenu',
  computed: {
    menuItems () {
      return [
        {
          title: this.$t('buttons.edit'),
          action: this.$emit('edit'),
          icon: 'edit',
          color: 'blue-grey'
        },
        {
          title: this.$t('buttons.cancelOff'),
          action: this.$emit('changeStatus', '-'),
          icon: 'horizontal-rule',
          color: 'deep-orange'
        },
        {
          title: this.$t('buttons.delete'),
          action: 'taskDelete',
          icon: 'trash',
          color: 'red'
        }
      ]
    }
  }
}
</script>

<style scoped>

</style>
