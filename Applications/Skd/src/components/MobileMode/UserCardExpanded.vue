<template>
  <v-layout wrap row>
    <v-flex class="user-photo" xs4>
      <svg-key class="user-key" v-if="user.hasKey"></svg-key>
      <user-photo class="mobile-photo-container-expanded" :photo="user.photoProperty.photoUrl"></user-photo>
    </v-flex>
    <v-flex class="user-info" xs7>
      <v-flex>
        <v-flex>
          <span>{{user.fullName}}</span>
        </v-flex>
        <v-flex>
          <div v-if="user.IsAbsend" class="user-absend">
            <span>{{user.placeName}}</span>
          </div>
          <div v-else :class='user.IsGone ? "user-gone" : "user-time"'>
            <div class="user-date-day">
              <span v-if="!user.DateTimeText.Today">{{user.DateTimeText.Day}}</span>
            </div>
            <div>
              <span>{{user.DateTimeText.Time }}</span>
              <span class="placename">{{user.placeName}}</span>
            </div>
          </div>
        </v-flex>
        <v-flex class="user-department">
          <span>{{user.department}}</span>
        </v-flex>
      </v-flex>
    </v-flex>
    <v-layout wrap>
      <v-flex class="user-details">
        <v-flex v-if="user.email" class="text-svg-container">
          <svg-email></svg-email>
          <a href="mailto:' + user.email'">
            <span v-on:click="userDataItemSelected = !userDataItemSelected" class="text-container">{{user.email}}</span>
          </a>
        </v-flex>
        <v-flex v-if="user.mobileTel"  class="text-svg-container">
          <svg-mobile-phone></svg-mobile-phone>
          <a class="text-information" :href="'tel:'+user.mobileTel">
            <span v-on:click="userDataItemSelected = !userDataItemSelected" class="text-container">{{user.mobileTel}}</span>
          </a>
        </v-flex>
        <v-flex v-if="user.skype" class="text-svg-container">
          <svg-skype></svg-skype>
          <a class="text-information" :href="'skype:'+user.skype">
          <span v-on:click="userDataItemSelected = !userDataItemSelected" class="text-container">{{user.skype}}</span>
          </a>
        </v-flex>
        <v-flex v-if="user.workTel" class="text-svg-container">
          <svg-office-phone></svg-office-phone>
          <span class="text-container">{{user.workTel}}</span>
        </v-flex>
        <v-flex v-if="user.birthday" class="text-svg-container">
          <svg-birthday></svg-birthday>
          <span class="text-container">{{user.birthday}}</span>
        </v-flex>
      </v-flex>
    </v-layout>
  </v-layout>
</template>

<script>
import userPhoto from "../UserPhoto";
import svgKey from "../../svg/svgKey";
import svgSkype from "../../svg/svgSkype";
import svgBirthday from "../../svg/svgBirthday";
import svgOfficePhone from "../../svg/svgOfficePhone";
import svgEmail from "../../svg/svgEmail";
import svgMobilePhone from "../../svg/svgMobilePhone";

export default {
  name: "user-card-expanded",
  components: {
    "user-photo": userPhoto,
    "svg-key": svgKey,
    "svg-skype": svgSkype,
    "svg-birthday": svgBirthday,
    "svg-office-phone": svgOfficePhone,
    "svg-email": svgEmail,
    "svg-mobile-phone": svgMobilePhone
  },
  computed: {
    userDataItemSelected: {
      get() { 
        return this.$store.getters['skd/getUserDataItemSelected'] 
      },
      set(value) {
        this.$store.commit('skd/setUserDataItemSelected', value)
      } 
    },
  },
  props: ["user"]
};
</script>

<style lang='scss' scoped>
.user-details {
  padding-top: 10px;
  padding-bottom: 5px;
  padding-left: 10px;
}
.text-svg-container {
  margin-bottom: 10px;
  align-items: center;
  font-size: 1.2em;
}
.text-container {
  padding-left: 3px;
}
.user-gone {
  color: red;
}
.user-absend {
  opacity: 0.5;
  font-size: 0.9em;
}
.placename {
  padding-left: 10px;
  font-weight: 400;
}
.user-department {
  font-size: 0.9em;
  color: #999;
}
.mobile-photo-container-expanded {
  margin: 5px;
  height: 95px;
  width: 95px;
  z-index: 3;
}
.user-key {
  left: 0px;
  top: 0px;
  position: absolute;
  z-index: 1;
  transform: rotate(-45deg);
}
.user-photo {
  position: relative;
}
</style>