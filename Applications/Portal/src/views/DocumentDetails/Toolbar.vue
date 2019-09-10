<template>
  <ul class="flex vx-navbar__starred-pages">
          <li class="starred-page">
            <vx-tooltip text="Вернуться к списку документов" position="right" delay=".3s">
              <feather-icon  class="p-2 cursor-pointer" icon="ArrowLeftIcon" @click="backToDocuments"></feather-icon>
            </vx-tooltip>
          </li>
          <li class="starred-page">
            <vx-tooltip text="Разнести документ" position="bottom" delay=".3s">
              <feather-icon  class="p-2 cursor-pointer" icon="FileTextIcon" @click=""></feather-icon>
            </vx-tooltip>
          </li>
          <li class="starred-page">
            <vx-tooltip text="Изменить документ" position="bottom" delay=".3s">
              <feather-icon  class="p-2 cursor-pointer" icon="EditIcon" @click=""></feather-icon>
            </vx-tooltip>
          </li>
            <li class="starred-page">
            <vx-tooltip text="Добавить строку" position="bottom" delay=".3s">
              <feather-icon  class="p-2 cursor-pointer" icon="FilePlusIcon" @click="addRow"></feather-icon>
            </vx-tooltip>
          </li>
      </ul>
</template>

<script>
export default {
  methods: {
    backToDocuments() {
      this.$router.push({name: 'documents'})
    },
    addRow() {
      this.$store.commit('app/setShowAddDocumentRowForm', true)
    }
  }
}
</script>

<style>

</style>
