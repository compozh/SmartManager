<template>
  <div :class="`d-flex ${ml}-5`">
    <div v-if="activeZone.title" class="subtitle-1 font-weight-medium">
      {{ activeZone.title }}
    </div>

    <div v-if="activeZone.group === 'processes' && this.process"
         class="subtitle-1 font-weight-medium">
      <fa-icon icon="chevron-right" size="xs" class="mx-3 grey--text"/>
      <span class="subtitle-1 font-weight-medium"
      >{{ this.process.name | capitalize }}</span>
    </div>

    <div v-else-if="activeZone.group !== 'processes' && activeFolder.Name"
         class="d-flex align-center">
      <fa-icon icon="chevron-right" size="xs" class="mx-3 grey--text"/>
      <span @click="$route.name === 'task-details' ? $router.push('/tasks/' + activeFolderId) : null"
            class="subtitle-1 font-weight-medium"
            :class="{'blue-grey--text': $route.name === 'task-details'}"
            :style="{cursor: $route.name === 'task-details' ? 'pointer' : ''}">
        {{ activeFolder.Name }}
      </span>
    </div>
  </div>
</template>

<script>
import { zones, folders, processes } from '@/mixins/units'

export default {
  name: 'Breadcrumb',
  mixins: [zones, folders, processes],

  filters: {
    capitalize (value) {
      if (!value) { return '' }
      return value.charAt(0).toUpperCase() + value.slice(1)
    }
  }
}
</script>
