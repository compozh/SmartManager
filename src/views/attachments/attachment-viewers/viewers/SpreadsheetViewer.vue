<template>
  <ejs-spreadsheet ref="spreadsheet"
                   :created="created"
                   :openUrl="openUrl"
                   :allowSave="false"
                   height="100%"
                   style='flex: 1 1 0;'>
  </ejs-spreadsheet>
</template>

<script>
import Vue from 'vue'
import { SpreadsheetPlugin } from '@syncfusion/ej2-vue-spreadsheet'
Vue.use(SpreadsheetPlugin)

export default {
  name: 'SpreadsheetViewer',
  props: {
    url: String
  },
  data: () => ({
    openUrl: window.appConfig.GqlUrl + 'api/spreadsheet/open'
  }),
  watch: {
    url (url, oldUrl) {
      if (url !== oldUrl) {
        this.$refs.spreadsheet.open({ file: url })
      }
    }
  },
  methods: {
    created () {
      const spreadsheet = this.$refs.spreadsheet
      spreadsheet.open({ file: this.url })
    }
  }
}
</script>

<style scoped>

  @import '~@syncfusion/ej2-base/styles/material.css';
  @import '~@syncfusion/ej2-buttons/styles/material.css';
  @import '~@syncfusion/ej2-dropdowns/styles/material.css';
  @import '~@syncfusion/ej2-inputs/styles/material.css';
  @import '~@syncfusion/ej2-navigations/styles/material.css';
  @import '~@syncfusion/ej2-popups/styles/material.css';
  @import '~@syncfusion/ej2-splitbuttons/styles/material.css';
  @import '~@syncfusion/ej2-grids/styles/material.css';
  @import "~@syncfusion/ej2-vue-spreadsheet/styles/material.css";

</style>
