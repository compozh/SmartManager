<template>
  <v-dialog v-model="caseDialog"
            persistent
            no-click-animation>
    <div class="d-flex justify-center align-center title">Page in develop... Coming soon!</div>
  </v-dialog>
</template>

<script>
import { cases } from '@/mixins/units'

export default {
  name: 'CaseDetails',
  mixins: [cases]
}
</script>

<style scoped>

</style>
