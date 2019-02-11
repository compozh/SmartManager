<template>
  <v-container grid-list-md>
    <v-layout row wrap class="rowusers">
      <v-flex xl2 class="photo">
        <photo-component :photo='userCopmonent.photo'></photo-component>
      </v-flex>

      <v-flex xl3 class="commoninformation">
        <v-flex xl12>{{userCopmonent.P_FIO}} </v-flex>
        <v-flex xl12>{{userCopmonent.R_DT}} </v-flex>
        <v-flex sl12>{{userCopmonent.PLACENAME}}</v-flex>
      </v-flex>

      <v-flex xl3 class="contactiformation">
        <v-flex xl12 >{{userCopmonent.EMAIL}}</v-flex>
        <v-flex xl12 >{{userCopmonent.TEL}}</v-flex>
        <v-flex xl12 >{{userCopmonent.TEL2}}</v-flex>
      </v-flex>

      <v-flex xl3 class="contactiformation">
        <v-flex xl12 >{{userCopmonent.BIRTHDAY}}</v-flex>
        <v-flex xl12 >{{userCopmonent.SKYPE}}</v-flex>
      </v-flex>
      <v-flex x1 class="departament">{{userCopmonent.DEPARTMENT}}</v-flex>
    </v-layout>
    
  </v-container>
    
</template>

<script>
import vuetify from "vuetify"
import PhotoComponent from "./photocomponent"
// component on photo можно передать  user.photo а в компоненте на фотоо будет выводиться фото
export default {
  props: ['userCopmonent'], //указываю свойсвто  users_list для считывания списка изверов
  components: {
        'photo-component': PhotoComponent // объявляю пользовательский компонент
    },
}
</script>

<style>
.commoninformation{
  text-align: left;
}
.departament{
  text-align: left;

}

.contactiformation{
  text-align: left;

}
.rowusers:hover{
background-color: #263238;
color: white;
}
</style>
