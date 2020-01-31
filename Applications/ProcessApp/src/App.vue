<template>
  <div id="app">
    <div class="formio-container">
       <formio-form-component
            ref="formioFormComponent"

            @formSubmit=formSubmit
            :formDefinition="form"
            :formCode="form.name"
          />
    </div>
    <button class="actionBtn" @click="onActionBtnClick">AAAAAA</button>
    <process-snackbar/>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  created() {
    if (!this.$route.query) {
      console.log("Process is undefined")
      return
    }
    const processDefinitionId = this.$route.query.process
    this.$store.dispatch('getForm', processDefinitionId)
  },
  computed: {
    form() {
      return this.$store.getters['form']
    }
  },
  methods: {
    onActionBtnClick () {
      debugger
      this.$store.commit('setSnackbarMessage', 'sasadasdassasada', 'error')
      console.log('asdaasda')
    },
    formSubmit () {
      console.log('formio submit')
    }
  }
}
</script>
<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.actionBtn {
  height: 40px;
  min-width: 170px;
  background: #fff;
  border: 2px solid rgb(25, 118, 210);
  color: rgb(25, 118, 210);
  font-weight: 600;
  text-transform: uppercase;
  border-radius: 4px;
}
</style>
