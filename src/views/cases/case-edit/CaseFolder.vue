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
                          :btn-click="() => newFolderDialog = true">
          {{ $t('folders.createFolder') }}
        </icon-tooltip-btn>
      </template>
    </v-select>

    <dialog-card v-model="newFolderDialog" width="600px"
                 :title="$t('cases.newFolder')"
                 @close="newFolderDialog = false">
      <template #text>
        <v-form ref="form" @submit.prevent>
          <v-text-field v-model="newFolderName"
                        :rules="rules"
                        counter="25"
                        hint="This field uses counter prop"
                        label="Regular"/>
        </v-form>
      </template>
      <template #actions>
        <v-spacer/>
        <outlined-btn x-small
                      color="success"
                      icon="folder-plus"
                      :handler="() => createFolder()">
          <span>{{ $t('buttons.add') }}</span>
        </outlined-btn>
      </template>
    </dialog-card>
  </div>
</template>

<script>
const DialogCard = () => import('@/components/DialogCard')
const OutlinedBtn = () => import('@/components/OutlinedBtn')
const IconTooltipBtn = () => import('@/components/IconTooltipBtn')

export default {
  name: 'CaseFolder',
  model: {
    prop: 'folder'
  },
  props: {
    folder: Object
  },
  components: {
    OutlinedBtn,
    DialogCard,
    IconTooltipBtn
  },
  data: () => ({
    loading: false,
    newFolderDialog: false,
    newFolderName: '',
    menuProps: {
      offsetY: true
    },
    rules: [v => v.length <= 25 || 'Max 25 characters']
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
    },
    createFolder () {
      this.$refs.folderName.validate(true)
    }
  }
}
</script>

<style scoped>

</style>
