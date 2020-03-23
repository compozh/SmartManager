<template>
  <v-breadcrumbs :items="items" class="hidden-md-and-down">
    <template v-slot:divider>
      <fa-icon :icon="['fal', 'chevron-right']" size="xs"/>
    </template>
  </v-breadcrumbs>
</template>

<script>
export default {
  name: 'BreadCrumb',
  data: () => ({
    items: [
      {
        text: 'Login',
        disabled: false,
        exact: true,
        to: '/login'
      },
      {
        text: 'Link 1',
        disabled: false,
        href: 'breadcrumbs_link_1'
      },
      {
        text: 'Link 2',
        disabled: true,
        href: 'breadcrumbs_link_2'
      }
    ]
  })
}
</script>

<style scoped>

</style>
