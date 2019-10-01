<template>
  <div>
    <vs-row>

      <vs-col :key="comp" vs-type="flex" vs-justify="center"  vs-w="6" v-for="comp in components">
        <component  :is="comp" :min-mode="true" style="width:100%"></component>
      </vs-col>
    </vs-row>
  </div>
</template>

<script>

const COMPONENT_NAME = 'account-home-page'

export default {

  computed: {
    components() {
      if (!this.$store.state.app.applicationDescription) {
        return
      }
      return this.$store.state.app.applicationDescription
        .Sections[0].Routes
        .map(a => a.Components)
        .reduce((a,b) => a.concat(b))
        .filter( r => !r.NameInRoute && r.Name != COMPONENT_NAME)

        .map(r => r.Name)
    }
  }
}
</script>

<style>

</style>
