<template>
  <no-data/>
</template>

<script>
import NoData from '@/views/attachments/attachments-viewers/NoData'
import { zones, folders, cases } from '@/mixins/units'

export default {
  name: 'CaseList',
  mixins: [zones, folders, cases],
  components: {
    NoData
  },
  created () {
    this.getCases()
  }
}
</script>

<style scoped>

</style>
