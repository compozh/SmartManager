<template>
  <div class="flex flex-col flex-1">
    <div class="flex" style="height: 50%">
      <VuePerfectScrollbar class="flex-1" :settings="settings">
        <table>
          <tr>
            <th>{{ $t('table.sign') }}</th>
            <th>{{ $t('table.description') }}</th>
            <th>{{ $t('table.name') }}</th>
            <th>{{ $t('table.size') }}</th>
            <th>{{ $t('table.version') }}</th>
            <th>{{ $t('table.status') }}</th>
            <th>{{ $t('table.date') }}</th>
          </tr>
          <tr v-for="(version, index) in versions" :key="index"
              :class="{active: index === currentVersion}"
              @click="currentVersion = index">
            <td><vs-icon v-if="index % 2">done</vs-icon></td>
            <td>description</td>
            <td class="text-left">{{ attachment.fileName }}</td>
            <td>{{ fileSize(attachment.fileSize) }}</td>
            <td>{{ version.Version }}</td>
            <td>status</td>
            <td>{{ version.Date }}</td>
          </tr>
        </table>
      </VuePerfectScrollbar>
    </div>
    <div class="flex" style="height: 50%">
      <VuePerfectScrollbar class="flex-1" :settings="settings">
        <table>
          <tr>
            <th>{{ $t('table.description') }}</th>
            <th>{{ $t('table.status') }}</th>
            <th>{{ $t('table.date') }}</th>
            <th>{{ $t('table.name') }}</th>
          </tr>
          <tr v-for="(remark, index) in remarks" :key="index">
            <td>{{ remark.description }}</td>
            <td><vs-icon v-if="remark.eliminated">done</vs-icon></td>
            <td>{{ remark.date }}</td>
            <td>{{ remark.author }}</td>
          </tr>
        </table>
      </VuePerfectScrollbar>
    </div>
  </div>
</template>

<script>
import VuePerfectScrollbar from 'vue-perfect-scrollbar'

export default {
  name: 'versions-and-remarks',
  components: {
    VuePerfectScrollbar
  },
  data: () => ({
    currentVersion: 0,
    settings: {
      maxScrollbarLength: 60,
      wheelSpeed: 0.50,
    },
    remarks: [
      {
        description: 'дополнить',
        eliminated: false,
        date: '17.02.2020',
        author: 'Игорь Певчев'
      },
      {
        description: 'исправить',
        eliminated: true,
        date: '18.02.2020',
        author: 'Игорь Певчев'
      },
      {
        description: '',
        eliminated: false,
        date: '19.02.2020',
        author: 'Игорь Певчев'
      },
      {
        description: 'отформатировать',
        eliminated: false,
        date: '20.02.2020',
        author: 'Игорь Певчев'
      },
    ]
  }),
  computed: {
    task() {
      const id = +this.$route.params.taskId
      const task = this.$store.state.sm.taskInfo[id]
      return task ? task : {}
    },
    originals() {
      return this.task.originals
      && this.task.originals.length
        ? this.task.originals
        : []
    },
    attachment()  {
      const id = +this.$route.params.attachmentId
      return this.originals.find(o => o.id === id) || {}
    },
    versions() {
      // return this.attachment.versions
      const versions = this.attachment.versions
      const result = []
      versions.map(v => {
        for (let i = 0; i < 10; i++) {
          result.push(v)
        }
      })
      return result
    },
    fileSize() {
      return size => {
        switch (true) {
          case size < 1024: return `${size} Byte`
          case size < 1024000: return `${(size / 1024).toFixed(1)} Kb`
          default: return `${(size / 1024 / 1024).toFixed(2)} Mb`
        }
      }
    },
  }
}
</script>

<style scoped>

</style>
