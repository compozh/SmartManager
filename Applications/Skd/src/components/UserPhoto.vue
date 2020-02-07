<template>
  <div :class='["photo", $vuetify.breakpoint.mdAndDown ? "md-photo-container" : "photo-container"]'>
    <i class='material-icons'
       v-if='"https://m.it.ua/ws/GetFile.ashx?file=&folder=content&nodownload=1" == photo'>person</i>
    <img :src='photo' height='auto' v-else alt='Photo'>
  </div>
</template>

<script>
export default {
  props: ['photo']
}
</script>
<style lang='scss' scoped>
  .md-photo-container {
    margin: 5px;
    height: 60px;
    width: 60px;

    .material-icons {
      font-size: 60px;
    }
  }

  .photo {
    border-radius: 50%;
    overflow: hidden;
    box-shadow: 0 0 17px -7px black;

    img {
      width: inherit;
    }

    .material-icons {
      color: #ddd;
    }
  }

  .photo-container {
    margin: 10px;
    height: 80px;
    width: 80px;

    .material-icons {
      font-size: 80px;
    }
  }
</style>
