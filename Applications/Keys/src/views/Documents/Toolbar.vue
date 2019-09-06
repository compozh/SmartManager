<template>
  <ul class="flex vx-navbar__starred-pages">

          <li class="starred-page">
            <vx-tooltip text="Добавить документ" position="bottom" delay=".3s">
              <feather-icon  class="p-2 cursor-pointer" icon="FilePlusIcon" @click="addButtonClick"></feather-icon>
            </vx-tooltip>
          </li>
          <!-- <li class="starred-page">
            <vx-tooltip text="Разнести документ" position="bottom" delay=".3s">
              <feather-icon  class="p-2 cursor-pointer" icon="FileTextIcon" @click=""></feather-icon>
            </vx-tooltip>
          </li> -->
      </ul>
</template>

<script>
export default {
  methods: {
    addButtonClick() {
      this.$store.commit('app/setShowAddDocumentForm', true)
    }
  }
}
</script>

<style>

</style>
