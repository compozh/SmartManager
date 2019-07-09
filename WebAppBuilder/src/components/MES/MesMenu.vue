<template>
  <div>
    <div>1</div>
    <div :class="{enabled:isEnabled}">2</div>
    <div>1</div>
    <div>3</div>
    <div>1</div>
  </div>
</template>
<script>
export default {
  name:"mes-menu",
  data(){
    return {
      color:"green"
    }
  },
  computed:{
    isEnabled(){
      return false
    }
  }
}
</script>
<style>
.enabled{

}
</style>
