<template>
  <div class="d-flex ml-5">
    <div v-if="activeZone.title" class="subtitle-1 font-weight-medium">
      {{ activeZone.title }}
    </div>

    <div v-if="activeZone.group === 'processes' && $route.query.processId"
         class="subtitle-1 font-weight-medium text-capitalize">
      <fa-icon icon="chevron-right" size="xs" class="ml-3 mr-2 grey--text"/>
      <span class="subtitle-1 font-weight-medium text-capitalize">
        {{ $route.query.processId }}
      </span>
    </div>

    <div v-else-if="activeZone.group !== 'processes' && activeFolder.Name"
         class="d-flex align-center">
      <fa-icon icon="chevron-right" size="xs" class="ml-3 mr-2 grey--text"/>
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
import { zones, folders } from '@/mixins/units'

export default {
  name: 'Breadcrumb',
  mixins: [zones, folders],
  computed: {
    items () {
      return []
    }
  }
}
</script>

<style scoped>

</style>
