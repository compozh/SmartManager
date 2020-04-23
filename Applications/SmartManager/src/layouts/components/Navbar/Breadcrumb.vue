<template>
  <div class="d-flex ml-5">
    <div v-if="activeZone.title" class="subtitle-1 font-weight-medium">
      {{ activeZone.title }}
    </div>
    <div v-if="activeFolder.Name || activeZone.title === 'Force BPM'">
      <fa-icon icon="chevron-right" size="xs" class="mx-3 grey--text"/>
    </div>

    <div v-if="activeZone.title === 'Force BPM'"
         class="subtitle-1 font-weight-medium text-capitalize">{{ $route.name }}</div>

    <div v-else-if="activeFolder.Name" class="subtitle-1 font-weight-medium">
      <span @click="$route.name === 'task-details' ? $router.go(-1) : null"
            :class="{'blue-grey--text': $route.name === 'task-details'}">
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
