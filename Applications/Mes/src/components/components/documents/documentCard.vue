<template>
  <v-flex class="documents-list-block">
    <div v-for="document in this.documents" :key="document.id">
      <v-card ripple
        class="document-item"
        @click="changeCurrentDocument(document)"
      >
        <v-card-text :class="selectedDocument && document.id == selectedDocument.id ? 'active-document-item' : 'inactive-document-item'">
          <span v-html="document.description"></span>
          <v-speed-dial
            class="document-card-menu"
              absolute
              right
              top
              direction="bottom"
              transition="scroll-y-transition"
              v-model="document.fab"
            >
            <template v-slot:activator>
                <v-btn
                class="document-card-menu-btn"
                icon
                width="30px"
                height="30px"
                :loading="processMethodInProgress"
                color="#326da8"
                v-model="document.fab"
                >
                  <v-icon>
                      more_vert
                  </v-icon>
                </v-btn>
            </template>
            <v-tooltip right v-for="method in pageProps.methods" :key="method.code">
                <template v-slot:activator="{ on }">
                  <v-btn icon color="#326da8" class="mes-document-method-btn" @click="applyMethodBtn(document, method)" v-on="on">
                      <v-icon dark>{{method.iconCode}}</v-icon>
                  </v-btn>
                </template>
                <span>{{method.name}}</span>
            </v-tooltip>
          </v-speed-dial>
        </v-card-text>
      </v-card>
    </div>
  </v-flex>
</template>

<script>

export default {
  name: 'mes-document-cards',
  data() {
    return {
      processMethodInProgress: false
    }
  },
  props: {
    pageProps: Object
  },
  computed: {
    documents() {
      return this.$store.getters['mes/documents']
    },
    workCenter() {
      return this.$store.getters['mes/workCenter']
    },
    selectedDocument: {
      get() {
        return this.$store.getters['mes/selectedDocument']
      }
    }
  },
  methods: {
    changeCurrentDocument(newDocument) {
      this.$emit('changeCurrentDocument', newDocument)
    },
    converDate(date) {
      date = new Date(date)
      let getDay = date.getDate().toString(),
        getMonth = (date.getMonth() + 1).toString(),
        getYear = date.getYear().toString(),
        getHours = date.getHours().toString(),
        getMinutes = date.getMinutes().toString(),
        day = getDay.length == 1 ? '0' + getDay : getDay,
        month = getMonth.length == 1 ? '0' + getMonth : getMonth,
        year = getYear.replace('1', '', 1),
        hours = getHours.length == 1 ? '0' + getHours : getHours,
        minutes = getMinutes.length == 1 ? '0' + getMinutes : getMinutes
      return day + '.' + month + '.' + year + ' ' + hours + ':' + minutes
    },
    async applyMethodBtn( document, method ) {
      await this.$store.dispatch('mes/applyDocumentMethod', { processId: document.id, processType: this.pageProps.id, methodCode: method.code, workCenterCode: this.workCenter.code })
    },
  }
}
</script>

<style type="text/css" scoped>
.documents-list-block {
  display: flex;
  width: 100%;
  flex-direction: column;
}
.document-item {
  margin: 5px 10px;
  cursor: pointer;
  text-align: center;
}
.active-document-item {
  display: flex;
  flex-direction: column;
  text-align: center;
  background-color: #d5e5ff;
}
.inactive-document-item {
  display: flex;
  flex-direction: column;
  text-align: center;
}
.document-card-menu  {
  position: absolute;
  top: 0;
  right: 0;
  width: 40px;
}
.btns-card {
  width: 35px;
}
</style>
