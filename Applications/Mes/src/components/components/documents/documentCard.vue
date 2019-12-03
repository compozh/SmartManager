<template>
  <v-flex class="documents-list-block">
    <div v-for="document in this.documents" :key="document.id">
      <v-card ripple
        class="document-item"
        @click="changeCurrentDocument(document)"
      >
        <v-card-text :class="selectedDocument && document.id == selectedDocument.id ? 'active-document-item' : 'inactive-document-item'">
          <span v-html="document.description"></span>
        </v-card-text>
      </v-card>
    </div>
  </v-flex>
</template>

<script>

export default {
  name: 'mes-document-cards',
  computed: {
    documents() {
      return this.$store.getters['mes/documents']
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
    }
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
</style>
