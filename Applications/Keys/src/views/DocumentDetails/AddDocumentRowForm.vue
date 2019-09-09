<template>
   <div>
    <vs-popup @click.stop :button-close-hidden="false" class="create-document overflow-visible" title="Создать документ" :active="active">
      <div class="vx-row mb-6">
        <div class="vx-col w-2/3">
          <vs-input v-validate="'required'" name="documentNumber" class="w-full" placeholder="Номер документа" v-model="documentNumber" />
        </div>
        <div class="vx-col w-1/3">

        </div>
      </div>

      <div class="vx-row mb-6">
        <div class="vx-col w-full">
          <vs-textarea label="Примечания" v-model="comment" />
        </div>
      </div>
      <vs-button class="mr-3" color="primary" @click.stop="onCreate" type="filled">Создать</vs-button>
      <vs-button color="primary" type="border" @click.stop="onCancel">Отмена</vs-button>
    </vs-popup>
  </div>
</template>

<script>
export default {
  props: {
    active: Boolean
  },
  data() {
    return {
      documentNumber: undefined,
      documentDate: undefined,
      comment: ''
    }
  },
  computed: {

  },
  methods: {
    onCreate() {
      this.$validator.validateAll().then(result => {

        if (result) {
          this.$store.dispatch('app/addDocument', { number: this.documentNumber, date: this.documentDate, comment: this.comment }).then(resp => {
            this.$router.push({name: 'document', params: {id: resp.id }})
            this.$store.commit('app/setShowAddDocumentForm', false)
          })
        }
      })
    },
    onCancel() {
      this.$store.commit('app/setShowAddDocumentRowForm', false)
    }
  }
}
</script>

<style lang="scss" >
.create-document {
  .vs-popup--content{
    overflow: visible;
  }
  .vs-popup--close{
    display: none
  }
}
</style>
