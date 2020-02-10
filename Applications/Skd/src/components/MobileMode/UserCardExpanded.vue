<template>
  <v-layout wrap row >
    <v-flex class="user-photo" xs4>
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
      <v-flex>
        <v-flex v-if="user.email" class="text-svg-container">
          <svg-email></svg-email>
          <a href='ailto:" + user.email'>
            <span class="text-container">{{user.email}}</span>
          </a>
        </v-flex>
        <v-flex v-if="user.mobileTel" class="text-svg-container">
          <svg-mobile-phone></svg-mobile-phone>
          <a class="text-information" :href="'tel:'+user.mobileTel">
            <span class="text-container">{{user.mobileTel}}</span>
          </a>
        </v-flex>
        <v-flex v-if="user.workTel" class="text-svg-container">
          <svg-office-phone></svg-office-phone>
          <span class="text-container">{{user.workTel}}</span>
        </v-flex>
      </v-flex>
      <v-flex>
        <v-flex v-if="user.skype" class="text-svg-container">
          <svg-skype></svg-skype>
          <span class="text-container">{{user.skype}}</span>
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
  data: () => ({}),
  props: ["user"]
};
</script>

<style lang='scss' scoped>
.text-svg-container {
  padding-bottom: 3px;
  padding-top: 5px;
  padding-left: 10px;

  font-size: 1em;
  display: flex;
  align-items: center;
}
.text-container {
  padding-left: 3px;
}
.key-style {
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
  // text-align: right;
  font-size: 0.8em;
  color: #999;
  // padding-right: 1em;
}
.mobile-photo-container-expanded {
  margin: 5px;
  height: 95px;
  width: 95px;
  
  i#empty-person-icon {
    color: #ddd;
    font-size: 95px;
  }
}
</style>