<template>
  <div class="d-flex align-center">
    <v-select
      :value="folder"
      :input="changeFolder"
      :items="folders"
      item-text="Name"
      return-object
      :loading="loading"
      :label="$t('folders.currentFolder')"
      :placeholder="$t('folders.placeholderSelect')"
      :menu-props="menuProps"
      hide-details>
      <template #prepend>
        <fa-icon icon="folder-open" size="lg"/>
      </template>
      <template #append-outer>
        <icon-tooltip-btn icon="folder-plus"
                          icon-type="fal"
                          icon-size="2x"
                          btn-color="primary"
                          tooltip-position="top"
                          :btn-click="() => {}">
          {{ $t('folders.createFolder') }}
        </icon-tooltip-btn>
      </template>
    </v-select>
  </div>
</template>

<script>
import IconTooltipBtn from '@/components/IconTooltipBtn'

export default {
  name: 'CaseFolder',
  model: {
    prop: 'folder'
  },
  props: {
    folder: Object
  },
  components: {
    IconTooltipBtn
  },
  data: () => ({
    loading: false,
    menuProps: {
      offsetY: true
    }
  }),
  computed: {
    folders () {
      const folders = this.$store.getters.caseFolders
      return folders.filter(folder => folder.FolderId)
    }
  },
  methods: {
    async changeFolder (folder) {
      this.loading = true
      await setTimeout(() => console.log(folder), 1000)
      this.loading = false
    }
  }
}
</script>

<style scoped>

</style>
