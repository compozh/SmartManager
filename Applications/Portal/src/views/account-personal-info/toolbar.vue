<template>
  <div>
    <!-- кнопка редактирования -->
    <vx-tooltip text="Редактировать " class="flex items-center">
      <feather-icon class="px-3 cursor-pointer" icon="EditIcon" @click="onEdit"></feather-icon>
    </vx-tooltip>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },

  computed: {},
  methods: {
    onEdit() {
      this.$store.dispatch('personalInfo/setEditMode', true)
    }
  }
}
</script>

<style>
</style>
