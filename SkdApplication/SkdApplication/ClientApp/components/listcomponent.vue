<template>
  <v-flex class="rowusers" :class="{'ma-0':$vuetify.breakpoint.mdAndDown}" row wrap>
    <v-card class="user-card" style="width: 100%">
      <v-layout column>
        <v-layout>
          <v-flex :class="[$vuetify.breakpoint.mdAndDown ? 'md-photo':'photo' ]">
            <photo-component :photo="userCopmonent.photo"></photo-component>
          </v-flex>

          <v-flex class="commoninformation">
            <v-flex class="container-fio-key">
              <h4>{{userCopmonent.P_FIO}}</h4>
              <div class="container-key" v-if="userCopmonent.HASKEY == '+'">
                <svg-key></svg-key>
              </div>
            </v-flex>
            <v-flex>
              <div v-if="!userCopmonent.DateTimeText.Today" class="user-date">
                <span class="user-date-date">{{userCopmonent.DateTimeText.Date}}</span>
                <span class="user-date-day">{{userCopmonent.DateTimeText.Day}}</span>
              </div>
              <div
                :class="[userCopmonent.IsGone ? 'user-gone' : '', userCopmonent.IsAbsend?'user-absent':'', 'user-time']"
              >
                <span>{{userCopmonent.DateTimeText.Time}}</span>
                <span class="placename">{{userCopmonent.PLACENAME}}</span>
              </div>
            </v-flex>
          </v-flex>

          <v-flex class="contactiformation hidden-md-and-down">
            <v-flex v-if="userCopmonent.EMAIL">
              <svg-email></svg-email>
              <a :href="'mailto:'+userCopmonent.EMAIL">{{userCopmonent.EMAIL}}</a>
            </v-flex>
            <v-flex v-if="userCopmonent.TEL">
              <svg-mobile-phone></svg-mobile-phone>
              <a :href="'callto:'+userCopmonent.TEL">{{userCopmonent.TEL}}</a>
            </v-flex>
            <v-flex v-if="userCopmonent.TEL2">
              <svg-office-phone></svg-office-phone>
              {{userCopmonent.TEL2}}
            </v-flex>
          </v-flex>

          <v-flex class="contactiformation hidden-md-and-down">
            <v-flex v-if="userCopmonent.BIRTHDAY">
              <svg-birthday></svg-birthday>
              {{userCopmonent.BIRTHDAY}}
            </v-flex>
            <v-flex v-if="userCopmonent.SKYPE">
              <svg-skype></svg-skype>
              {{userCopmonent.SKYPE}}
            </v-flex>
          </v-flex>
          <v-flex class="departament">{{userCopmonent.DEPARTMENT}}</v-flex>
          <v-flex v-on:click="openMoreInformation=!openMoreInformation">
            <div class="container-information-arrow"  v-if="$vuetify.breakpoint.mdAndDown">
              <i
                v-if="!openMoreInformation"
                class="material-icons information-arraw"
              >keyboard_arrow_down</i>
              <i
                v-if="openMoreInformation"
                class="material-icons information-arraw"
              >keyboard_arrow_up</i>
            </div>
          </v-flex>
        </v-layout>
        <!-- разделение между обычным layout и подробной информацией о пользователе -->
        <v-layout
          v-if="$vuetify.breakpoint.mdAndDown && openMoreInformation"
          class="information-layout"
        >
          <v-flex></v-flex>
          <v-flex>
            <v-flex v-if="userCopmonent.EMAIL">
              <svg-email></svg-email>
              <a :href="'mailto:'+userCopmonent.EMAIL">{{userCopmonent.EMAIL}}</a>
            </v-flex>
            <v-flex v-if="userCopmonent.TEL">
              <svg-mobile-phone></svg-mobile-phone>
              <a :href="'callto:'+userCopmonent.TEL">{{userCopmonent.TEL}}</a>
            </v-flex>
            <v-flex v-if="userCopmonent.TEL2">
              <svg-office-phone></svg-office-phone>
              {{userCopmonent.TEL2}}
            </v-flex>
          </v-flex>

          <v-flex>
            <v-flex v-if="userCopmonent.BIRTHDAY">
              <svg-birthday></svg-birthday>
              {{userCopmonent.BIRTHDAY}}
            </v-flex>
            <v-flex v-if="userCopmonent.SKYPE">
              <svg-skype></svg-skype>
              {{userCopmonent.SKYPE}}
            </v-flex>
          </v-flex>
        </v-layout>
      </v-layout>
    </v-card>
  </v-flex>
</template>

<script>
import PhotoComponent from "./photocomponent";
import svgSkype from "./svg/svgSkype";
import svgBirthday from "./svg/svgBirthday";
import svgOfficePhone from "./svg/svgOfficePhone";
import svgEmail from "./svg/svgEmail";
import svgMobilePhone from "./svg/svgMobilePhone";
import svgKey from "./svg/svgKey";

// component on photo можно передать  user.photo а в компоненте на фотоо будет выводиться фото
export default {
  props: ["userCopmonent"], //указываю свойсвто  users_list для считывания списка изверов
  components: {
    "photo-component": PhotoComponent, // объявляю пользовательский компонент
    "svg-skype": svgSkype,
    "svg-birthday": svgBirthday,
    "svg-office-phone": svgOfficePhone,
    "svg-email": svgEmail,
    "svg-mobile-phone": svgMobilePhone,
    "svg-key": svgKey
  },
  data() {
    return {
      openMoreInformation: false
    };
  }
};
</script>
<style scoped lang="scss">
.information-arraw {
  height: 35px;
}
.container-information-arrow {
  height: 100%;
  text-align: right;
}
.information-layout {
  padding-bottom: 15px;
}
.icon-svg {
  width: 12px;
  height: 12px;
  color: #9e9e9e;
  fill: #9e9e9e;
}
.user-date-date {
  font-size: 0.9em;
}
.user-date {
  line-height: 1;
}
.container-fio-key {
  display: flex;
}
.container-key {
  height: 20px;
  padding-left: 10px;
}
.with-key {
  color: #ff9800;
  width: 18px;
  height: 18px;
}
.md-photo {
  flex-basis: 60px;
  max-width: 60px;
}
.photo {
  flex-basis: 100px;
  max-width: 100px;
}
.rowusers {
  margin: 10px;
}
.user-card {
  display: flex;
  flex-direction: row;
}
.user-date-day {
  color: #999;
  font-size: 0.9em;
}
.placename {
  font-weight: 500;
}
.user-gone {
  color: red;
}
.user-absent {
  opacity: 0.5;
  .placename {
    font-weight: 400;
  }
}
.departament {
  text-align: right;
}
</style>
