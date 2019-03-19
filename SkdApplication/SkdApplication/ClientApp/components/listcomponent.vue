<template>
  <v-flex class="rowusers" :class="{'ma-0':$vuetify.breakpoint.mdAndDown}" row wrap>
    <v-card class="user-card" style="width: 100%">
      <v-layout column>
        <v-layout>
          <v-flex :class="[$vuetify.breakpoint.mdAndDown ? 'md-photo':'photo' ]">
            <photo-component :photo="userCopmonent.photo"></photo-component>
          </v-flex>

          <v-flex :class="positionFIOInformationClass">
            <v-flex class="container-fio-key icon-text-alignment">
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

          <v-flex :class="contactInformationComponentClass">
            <v-flex class="icon-text-alignment" v-if="userCopmonent.EMAIL">
              <svg-email></svg-email>
              <a
                class="text-information"
                :href="'mailto:'+userCopmonent.EMAIL"
              >{{userCopmonent.EMAIL}}</a>
            </v-flex>
            <v-flex class="icon-text-alignment" v-if="userCopmonent.TEL">
              <svg-mobile-phone></svg-mobile-phone>
              <a class="text-information" :href="'tel:'+userCopmonent.TEL">{{userCopmonent.TEL}}</a>
            </v-flex>
            <v-flex class="icon-text-alignment" v-if="userCopmonent.TEL2">
              <svg-office-phone></svg-office-phone>
              <span class="text-information">{{userCopmonent.TEL2}}</span>
            </v-flex>
          </v-flex>

          <v-flex :class="dateSkypeComponentClass">
            <v-flex class="icon-text-alignment" v-if="userCopmonent.BIRTHDAY">
              <svg-birthday></svg-birthday>
              <span class="text-information">{{userCopmonent.BIRTHDAY}}</span>
            </v-flex>
            <v-flex class="icon-text-alignment" v-if="userCopmonent.SKYPE">
              <svg-skype></svg-skype>
              <span class="text-information">{{userCopmonent.SKYPE}}</span>
            </v-flex>
          </v-flex>
          <v-flex :class="departamentComponentClass">{{userCopmonent.DEPARTMENT}}</v-flex>
          <v-flex
            class="container-arrow"
            v-if="$vuetify.breakpoint.mdAndDown"
            v-on:click="openMoreInformation=!openMoreInformation"
          >
            <div class="container-information-arrow">
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
          <v-flex :class="mobileContactInformationClass">
            <v-flex class="icon-text-alignment" v-if="userCopmonent.EMAIL">
              <svg-email></svg-email>
              <a
                class="text-information"
                :href="'mailto:'+userCopmonent.EMAIL"
              >{{userCopmonent.EMAIL}}</a>
            </v-flex>
            <v-flex class="icon-text-alignment" v-if="userCopmonent.TEL">
              <svg-mobile-phone></svg-mobile-phone>
              <a class="text-information" :href="'tel:'+userCopmonent.TEL">{{userCopmonent.TEL}}</a>
            </v-flex>
            <v-flex class="icon-text-alignment" v-if="userCopmonent.TEL2">
              <svg-office-phone></svg-office-phone>
              <span class="text-information">{{userCopmonent.TEL2}}</span>
            </v-flex>
          </v-flex>

          <v-flex>
            <v-flex class="icon-text-alignment" v-if="userCopmonent.BIRTHDAY">
              <svg-birthday></svg-birthday>
              <span class="text-information">{{userCopmonent.BIRTHDAY}}</span>
            </v-flex>
            <v-flex class="icon-text-alignment" v-if="userCopmonent.SKYPE">
              <svg-skype></svg-skype>
              <span class="text-information">{{userCopmonent.SKYPE}}</span>
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
  },
  computed: {
    positionFIOInformationClass() {
      if (!this.$vuetify.breakpoint.mdAndDown) {
        return "contactinformation common-component-flex";
      }
    },
    contactInformationComponentClass() {
      if (!this.$vuetify.breakpoint.mdAndDown) {
        return "contactinformation hidden-md-and-down common-component-flex";
      } else {
        return "dont-show-contact-information";
      }
    },
    dateSkypeComponentClass() {
      if (!this.$vuetify.breakpoint.mdAndDown) {
        return "contactinformation hidden-md-and-down date-skype-component-flex";
      } else {
        return "dont-show-contact-information";
      }
    },
    departamentComponentClass() {
      if (!this.$vuetify.breakpoint.mdAndDown) {
        return "departament departament-component-flex";
      } else {
        return "departament-mobile-component";
      }
    },
    mobileContactInformationClass() {
      if (this.$vuetify.breakpoint.mdAndDown) {
        return "mobile-contact-information";
      }
    }
  }
};
</script>
<style scoped lang="scss">
.text-information {
  padding-left: 3px;
}
.icon-text-alignment {
  display: flex;
  align-items: center;
}
.mobile-contact-information {
  padding-left: 5px;
}
.container-arrow {
  flex-basis: 30px;
}
.departament-mobile-component {
  flex-basis: 100px;
}
.date-skype-component-flex {
  flex-basis: 0;
}
.dont-show-contact-information {
  display: none;
}
.common-component-flex {
  flex-basis: 0;
}
.departament-component-flex {
  flex-basis: 0;
  flex-grow: 0.5;
}
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
