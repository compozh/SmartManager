<template>
  <div>
    <ul class="flex items-center">
      <li class="flex items-center">
        <router-link to="/">
          <feather-icon icon="HomeIcon" svgClasses="h-5 w-5 mt-1 stroke-current text-primary"/>
        </router-link>
        <span class="breadcrumb-separator mx-2 flex items-center">
          <feather-icon icon="ChevronsRightIcon" svgClasses="w-4 h-4"/></span>
      </li>
      <li v-for="(segment, index) in breadcrumb" :key="index" class="flex items-center">
        <router-link v-if="index !== breadcrumb.length - 1"
                     :to="breadcrumbData(segment).url"
                     style="margin-top: 2px"
        >{{ breadcrumbData(segment).name }}</router-link>
        <span v-if="index !== breadcrumb.length - 1"
              class="breadcrumb-separator mx-2 flex items-center">
          <feather-icon icon="ChevronsRightIcon" svgClasses="w-4 h-4"/></span>
      </li>
      <li class="flex items-center">
        <span style="margin-top: 2px">{{ breadcrumbData(lastBreadcrumb).name }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
// todo: нек
export default {
  name: 'vx-breadcrumb',
  computed: {
    breadcrumb() {
      return this.$route.meta.breadcrumb
    },
    lastBreadcrumb() {
      return this.breadcrumb[this.breadcrumb.length - 1]
    },
    folders() {
      return this.$store.state.sm.folders
    },
    folderCode() {
      const folderCode = this.$store.state.sm.currentFolder
      if (folderCode === 'active') {
        return '' // conversion for all tasks
      }
      if (folderCode === 'all') {
        return 0 // conversion for all cases
      }
      return folderCode
    },
    taskFolder() {
      return this.folders
        ? this.folders.find(folder => folder.code === this.folderCode)
        : {}
    },
    task() {
      const id = +this.$route.params.taskId
      const task = this.$store.state.sm.taskInfo[id]
      return task ? task : {}
    },
    caseFolder() {
      return this.folders
        ? this.folders.find(folder => {
          return folder.folderId === +this.folderCode
                 && (folder.code === 'cases' || folder.code === null)
                 && folder.count === 0
        }) : {}
    },
    caseItem() {
      const id = +this.$route.params.caseId
      const caseItem = this.$store.state.sm.caseDetails[id]
      return caseItem ? caseItem : {}
    },
    breadcrumbData() {
      return breadcrumb => {
        switch (breadcrumb) {
          case 'taskFolder': return {
            name: this.taskFolder ? this.taskFolder.name : '',
            url: '/tasks/' + (this.taskFolder.code === '' && this.taskFolder.code !== null
              ? 'active' : this.taskFolder.code)
          }
          case 'task': return {
            name: this.task.name || this.task.docCaption || this.task.descript,
            url: '/task/' + this.task.id
          }
          case 'taskAttachments': return {
            name: this.$t('tabs.attachments'),
            url: '/task/' + this.task.id + '/attachments'
          }
          case 'taskComments': return {
            name: this.$t('tabs.comments'),
            url: '/task/' + this.task.id + '/comments'
          }
          case 'caseFolder': return {
            name: this.caseFolder ? this.caseFolder.name : '',
            url: '/cases/' + (this.caseFolder.folderId === 0 ? 'all' : this.caseFolder.folderId)
          }
          case 'case': return {
            name: this.caseItem.name,
            url: '/case/' + this.caseItem.id
          }
          case 'caseAttachments': return {
            name: this.$t('tabs.attachments'),
            url: '/case/' + this.caseItem.id + '/attachments'
          }
          case 'caseComments': return {
            name: this.$t('tabs.comments'),
            url: '/case/' + this.caseItem.id + '/comments'
          }
          default: return { name: '', url: ''}
        }
      }
    }
  }
}
</script>
