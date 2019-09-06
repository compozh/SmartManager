<template>
  <ul class="flex vx-navbar__starred-pages h-full items-center leading-none">
    <li class="starred-page">
      <vx-tooltip text="Удалить строку" delay=".3s">
        <feather-icon class="p-2 cursor-pointer" icon="Trash2Icon" @click></feather-icon>
      </vx-tooltip>
    </li>
    <li class="starred-page">
      <vx-tooltip text="Изменить" delay=".3s">
        <feather-icon class="p-2 cursor-pointer" icon="EditIcon" @click></feather-icon>
      </vx-tooltip>
    </li>
  </ul>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({})
</script>

