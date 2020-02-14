<template>
  <div class="photo">
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
.photo {
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 0 17px -7px black;

  img {
    width: inherit;
  }
}  
.desktop-photo-container {
  .material-icons {
    color: #ddd;
    font-size: 80px;
  }
}
.mobile-photo-container {
  .material-icons {
    color: #ddd;
    font-size: 50px;
  }
}
.mobile-photo-container-expanded {
  .material-icons {
    color: #ddd;
    font-size: 95px;
  }
}
</style>
