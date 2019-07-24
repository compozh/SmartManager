<template>
  <div v-if="modules">
    <div v-for="(moduleData, index) in modules" :key="index">
      <p>{{moduleData.moduleid}}</p>
      <p>{{moduleData.name}}</p>
      <p>{{moduleData.imageLink}}</p>
    </div>
  </div>
</template>
<script>

export default {
  name: "lms-modules",
  props: ["modules"],
  mounted() {
  }
}
</script>

<style scoped>

</style>
