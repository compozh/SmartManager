<template>
    <v-avatar :size="80" v-if="'https://m.it.ua/ws/GetFile.ashx?file=&folder=content&nodownload=1'==photo">
      <img src="https://img.icons8.com/metro/1600/guest-male.png">
    </v-avatar>
    <v-avatar  :size="80" v-else>
      <img  :src="photo">
    </v-avatar>
</template>

<script>

export default {
props: ['photo'] //указываю свойсвто  users_list для считывания списка изверов
}
</script>

<style>

</style>
