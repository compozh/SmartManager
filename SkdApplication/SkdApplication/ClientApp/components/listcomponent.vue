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
                <svg
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fas"
                  data-icon="key"
                  class="svg-inline--fa fa-key fa-w-16 with-key"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path
                    fill="currentColor"
                    d="M512 176.001C512 273.203 433.202 352 336 352c-11.22 0-22.19-1.062-32.827-3.069l-24.012 27.014A23.999 23.999 0 0 1 261.223 384H224v40c0 13.255-10.745 24-24 24h-40v40c0 13.255-10.745 24-24 24H24c-13.255 0-24-10.745-24-24v-78.059c0-6.365 2.529-12.47 7.029-16.971l161.802-161.802C163.108 213.814 160 195.271 160 176 160 78.798 238.797.001 335.999 0 433.488-.001 512 78.511 512 176.001zM336 128c0 26.51 21.49 48 48 48s48-21.49 48-48-21.49-48-48-48-48 21.49-48 48z"
                  ></path>
                </svg>
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
              <svg
                aria-hidden="true"
                focusable="false"
                data-prefix="fas"
                data-icon="at"
                class="svg-inline--fa fa-at fa-w-16 icon-svg"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path
                  fill="currentColor"
                  d="M256 8C118.941 8 8 118.919 8 256c0 137.059 110.919 248 248 248 48.154 0 95.342-14.14 135.408-40.223 12.005-7.815 14.625-24.288 5.552-35.372l-10.177-12.433c-7.671-9.371-21.179-11.667-31.373-5.129C325.92 429.757 291.314 440 256 440c-101.458 0-184-82.542-184-184S154.542 72 256 72c100.139 0 184 57.619 184 160 0 38.786-21.093 79.742-58.17 83.693-17.349-.454-16.91-12.857-13.476-30.024l23.433-121.11C394.653 149.75 383.308 136 368.225 136h-44.981a13.518 13.518 0 0 0-13.432 11.993l-.01.092c-14.697-17.901-40.448-21.775-59.971-21.775-74.58 0-137.831 62.234-137.831 151.46 0 65.303 36.785 105.87 96 105.87 26.984 0 57.369-15.637 74.991-38.333 9.522 34.104 40.613 34.103 70.71 34.103C462.609 379.41 504 307.798 504 232 504 95.653 394.023 8 256 8zm-21.68 304.43c-22.249 0-36.07-15.623-36.07-40.771 0-44.993 30.779-72.729 58.63-72.729 22.292 0 35.601 15.241 35.601 40.77 0 45.061-33.875 72.73-58.161 72.73z"
                ></path>
              </svg>
              <a :href="'mailto:'+userCopmonent.EMAIL">{{userCopmonent.EMAIL}}</a>
            </v-flex>
            <v-flex v-if="userCopmonent.TEL">
              <svg
                aria-hidden="true"
                focusable="false"
                data-prefix="fas"
                data-icon="phone"
                class="svg-inline--fa fa-phone fa-w-16 icon-svg"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path
                  fill="currentColor"
                  d="M493.4 24.6l-104-24c-11.3-2.6-22.9 3.3-27.5 13.9l-48 112c-4.2 9.8-1.4 21.3 6.9 28l60.6 49.6c-36 76.7-98.9 140.5-177.2 177.2l-49.6-60.6c-6.8-8.3-18.2-11.1-28-6.9l-112 48C3.9 366.5-2 378.1.6 389.4l24 104C27.1 504.2 36.7 512 48 512c256.1 0 464-207.5 464-464 0-11.2-7.7-20.9-18.6-23.4z"
                ></path>
              </svg>
              <a :href="'callto:'+userCopmonent.TEL">{{userCopmonent.TEL}}</a>
            </v-flex>
            <v-flex v-if="userCopmonent.TEL2">
              <svg class="icon-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                <path
                  d="M128 416h64c17.67 0 32-14.33 32-32V32c0-17.67-14.33-32-32-32h-64c-17.67 0-32 14.33-32 32v352c0 17.67 14.33 32 32 32zM528 32H256v352c0 35.29-28.71 64-64 64h-64c-35.29 0-64-28.71-64-64V32H48C21.49 32 0 53.49 0 80v384c0 26.51 21.49 48 48 48h480c26.51 0 48-21.49 48-48V80c0-26.51-21.49-48-48-48zM384 432c0 8.84-7.16 16-16 16h-32c-8.84 0-16-7.16-16-16v-32c0-8.84 7.16-16 16-16h32c8.84 0 16 7.16 16 16v32zm0-128c0 8.84-7.16 16-16 16h-32c-8.84 0-16-7.16-16-16v-32c0-8.84 7.16-16 16-16h32c8.84 0 16 7.16 16 16v32zm128 128c0 8.84-7.16 16-16 16h-32c-8.84 0-16-7.16-16-16v-32c0-8.84 7.16-16 16-16h32c8.84 0 16 7.16 16 16v32zm0-128c0 8.84-7.16 16-16 16h-32c-8.84 0-16-7.16-16-16v-32c0-8.84 7.16-16 16-16h32c8.84 0 16 7.16 16 16v32zm0-112H320V96h192v96z"
                ></path>
              </svg>
              {{userCopmonent.TEL2}}
            </v-flex>
          </v-flex>

          <v-flex class="contactiformation hidden-md-and-down">
            <v-flex v-if="userCopmonent.BIRTHDAY">
              <svg
                aria-hidden="true"
                focusable="false"
                data-prefix="far"
                data-icon="calendar-alt"
                class="svg-inline--fa fa-calendar-alt fa-w-14 icon-svg"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
              >
                <path
                  fill="currentColor"
                  d="M148 288h-40c-6.6 0-12-5.4-12-12v-40c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12zm108-12v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm96 0v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm-96 96v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm-96 0v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm192 0v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm96-260v352c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V112c0-26.5 21.5-48 48-48h48V12c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v52h128V12c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v52h48c26.5 0 48 21.5 48 48zm-48 346V160H48v298c0 3.3 2.7 6 6 6h340c3.3 0 6-2.7 6-6z"
                ></path>
              </svg>
              {{userCopmonent.BIRTHDAY}}
            </v-flex>
            <v-flex v-if="userCopmonent.SKYPE">
              <svg
                aria-hidden="true"
                focusable="false"
                data-prefix="fab"
                data-icon="skype"
                class="svg-inline--fa fa-skype fa-w-14 icon-svg"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
              >
                <path
                  fill="currentColor"
                  d="M424.7 299.8c2.9-14 4.7-28.9 4.7-43.8 0-113.5-91.9-205.3-205.3-205.3-14.9 0-29.7 1.7-43.8 4.7C161.3 40.7 137.7 32 112 32 50.2 32 0 82.2 0 144c0 25.7 8.7 49.3 23.3 68.2-2.9 14-4.7 28.9-4.7 43.8 0 113.5 91.9 205.3 205.3 205.3 14.9 0 29.7-1.7 43.8-4.7 19 14.6 42.6 23.3 68.2 23.3 61.8 0 112-50.2 112-112 .1-25.6-8.6-49.2-23.2-68.1zm-194.6 91.5c-65.6 0-120.5-29.2-120.5-65 0-16 9-30.6 29.5-30.6 31.2 0 34.1 44.9 88.1 44.9 25.7 0 42.3-11.4 42.3-26.3 0-18.7-16-21.6-42-28-62.5-15.4-117.8-22-117.8-87.2 0-59.2 58.6-81.1 109.1-81.1 55.1 0 110.8 21.9 110.8 55.4 0 16.9-11.4 31.8-30.3 31.8-28.3 0-29.2-33.5-75-33.5-25.7 0-42 7-42 22.5 0 19.8 20.8 21.8 69.1 33 41.4 9.3 90.7 26.8 90.7 77.6 0 59.1-57.1 86.5-112 86.5z"
                ></path>
              </svg>
              {{userCopmonent.SKYPE}}
            </v-flex>
          </v-flex>
          <v-flex class="departament">{{userCopmonent.DEPARTMENT}}
		  </v-flex>
		  		<v-flex v-on:click="openMoreInformation=!openMoreInformation" >
					  <div class="container-information-arrow">
						  	<i  v-if="!openMoreInformation" class="material-icons information-arraw"> keyboard_arrow_down </i>
					  		<i v-if="openMoreInformation" class="material-icons information-arraw"> keyboard_arrow_up </i>
					  </div>
				</v-flex>
        </v-layout>
		<!-- разделение между обычным layout и подробной информацией о пользователе -->
        <v-layout v-if="$vuetify.breakpoint.mdAndDown && openMoreInformation" class="information-layout">
			<v-flex></v-flex>
			<v-flex>
				<v-flex v-if="userCopmonent.EMAIL">
              <svg
                aria-hidden="true"
                focusable="false"
                data-prefix="fas"
                data-icon="at"
                class="svg-inline--fa fa-at fa-w-16 icon-svg"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path
                  fill="currentColor"
                  d="M256 8C118.941 8 8 118.919 8 256c0 137.059 110.919 248 248 248 48.154 0 95.342-14.14 135.408-40.223 12.005-7.815 14.625-24.288 5.552-35.372l-10.177-12.433c-7.671-9.371-21.179-11.667-31.373-5.129C325.92 429.757 291.314 440 256 440c-101.458 0-184-82.542-184-184S154.542 72 256 72c100.139 0 184 57.619 184 160 0 38.786-21.093 79.742-58.17 83.693-17.349-.454-16.91-12.857-13.476-30.024l23.433-121.11C394.653 149.75 383.308 136 368.225 136h-44.981a13.518 13.518 0 0 0-13.432 11.993l-.01.092c-14.697-17.901-40.448-21.775-59.971-21.775-74.58 0-137.831 62.234-137.831 151.46 0 65.303 36.785 105.87 96 105.87 26.984 0 57.369-15.637 74.991-38.333 9.522 34.104 40.613 34.103 70.71 34.103C462.609 379.41 504 307.798 504 232 504 95.653 394.023 8 256 8zm-21.68 304.43c-22.249 0-36.07-15.623-36.07-40.771 0-44.993 30.779-72.729 58.63-72.729 22.292 0 35.601 15.241 35.601 40.77 0 45.061-33.875 72.73-58.161 72.73z"
                ></path>
              </svg>
              <a :href="'mailto:'+userCopmonent.EMAIL">{{userCopmonent.EMAIL}}</a>
            </v-flex>
			<v-flex v-if="userCopmonent.TEL">
              <svg
                aria-hidden="true"
                focusable="false"
                data-prefix="fas"
                data-icon="phone"
                class="svg-inline--fa fa-phone fa-w-16 icon-svg"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path
                  fill="currentColor"
                  d="M493.4 24.6l-104-24c-11.3-2.6-22.9 3.3-27.5 13.9l-48 112c-4.2 9.8-1.4 21.3 6.9 28l60.6 49.6c-36 76.7-98.9 140.5-177.2 177.2l-49.6-60.6c-6.8-8.3-18.2-11.1-28-6.9l-112 48C3.9 366.5-2 378.1.6 389.4l24 104C27.1 504.2 36.7 512 48 512c256.1 0 464-207.5 464-464 0-11.2-7.7-20.9-18.6-23.4z"
                ></path>
              </svg>
              <a :href="'callto:'+userCopmonent.TEL">{{userCopmonent.TEL}}</a>
            </v-flex>
			<v-flex v-if="userCopmonent.TEL2">
              <svg class="icon-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                <path
                  d="M128 416h64c17.67 0 32-14.33 32-32V32c0-17.67-14.33-32-32-32h-64c-17.67 0-32 14.33-32 32v352c0 17.67 14.33 32 32 32zM528 32H256v352c0 35.29-28.71 64-64 64h-64c-35.29 0-64-28.71-64-64V32H48C21.49 32 0 53.49 0 80v384c0 26.51 21.49 48 48 48h480c26.51 0 48-21.49 48-48V80c0-26.51-21.49-48-48-48zM384 432c0 8.84-7.16 16-16 16h-32c-8.84 0-16-7.16-16-16v-32c0-8.84 7.16-16 16-16h32c8.84 0 16 7.16 16 16v32zm0-128c0 8.84-7.16 16-16 16h-32c-8.84 0-16-7.16-16-16v-32c0-8.84 7.16-16 16-16h32c8.84 0 16 7.16 16 16v32zm128 128c0 8.84-7.16 16-16 16h-32c-8.84 0-16-7.16-16-16v-32c0-8.84 7.16-16 16-16h32c8.84 0 16 7.16 16 16v32zm0-128c0 8.84-7.16 16-16 16h-32c-8.84 0-16-7.16-16-16v-32c0-8.84 7.16-16 16-16h32c8.84 0 16 7.16 16 16v32zm0-112H320V96h192v96z"
                ></path>
              </svg>
              {{userCopmonent.TEL2}}
            </v-flex>
			</v-flex>
			
			<v-flex>
				<v-flex v-if="userCopmonent.BIRTHDAY">
              <svg
                aria-hidden="true"
                focusable="false"
                data-prefix="far"
                data-icon="calendar-alt"
                class="svg-inline--fa fa-calendar-alt fa-w-14 icon-svg"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
              >
                <path
                  fill="currentColor"
                  d="M148 288h-40c-6.6 0-12-5.4-12-12v-40c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12zm108-12v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm96 0v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm-96 96v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm-96 0v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm192 0v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm96-260v352c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V112c0-26.5 21.5-48 48-48h48V12c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v52h128V12c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v52h48c26.5 0 48 21.5 48 48zm-48 346V160H48v298c0 3.3 2.7 6 6 6h340c3.3 0 6-2.7 6-6z"
                ></path>
              </svg>
              {{userCopmonent.BIRTHDAY}}
            </v-flex>
			<v-flex v-if="userCopmonent.SKYPE">
              <svg
                aria-hidden="true"
                focusable="false"
                data-prefix="fab"
                data-icon="skype"
                class="svg-inline--fa fa-skype fa-w-14 icon-svg"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
              >
                <path
                  fill="currentColor"
                  d="M424.7 299.8c2.9-14 4.7-28.9 4.7-43.8 0-113.5-91.9-205.3-205.3-205.3-14.9 0-29.7 1.7-43.8 4.7C161.3 40.7 137.7 32 112 32 50.2 32 0 82.2 0 144c0 25.7 8.7 49.3 23.3 68.2-2.9 14-4.7 28.9-4.7 43.8 0 113.5 91.9 205.3 205.3 205.3 14.9 0 29.7-1.7 43.8-4.7 19 14.6 42.6 23.3 68.2 23.3 61.8 0 112-50.2 112-112 .1-25.6-8.6-49.2-23.2-68.1zm-194.6 91.5c-65.6 0-120.5-29.2-120.5-65 0-16 9-30.6 29.5-30.6 31.2 0 34.1 44.9 88.1 44.9 25.7 0 42.3-11.4 42.3-26.3 0-18.7-16-21.6-42-28-62.5-15.4-117.8-22-117.8-87.2 0-59.2 58.6-81.1 109.1-81.1 55.1 0 110.8 21.9 110.8 55.4 0 16.9-11.4 31.8-30.3 31.8-28.3 0-29.2-33.5-75-33.5-25.7 0-42 7-42 22.5 0 19.8 20.8 21.8 69.1 33 41.4 9.3 90.7 26.8 90.7 77.6 0 59.1-57.1 86.5-112 86.5z"
                ></path>
              </svg>
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
// component on photo можно передать  user.photo а в компоненте на фотоо будет выводиться фото
export default {
  props: ["userCopmonent"], //указываю свойсвто  users_list для считывания списка изверов
  components: {
    "photo-component": PhotoComponent // объявляю пользовательский компонент
  },
  data() {
    return {
      openMoreInformation: false
    };
  },
  methods: {
    test: function() {
      console.log("test");
    }
  }
};
</script>

<style scoped lang="scss">
.information-arraw{
	height: 35px;
}
.container-information-arrow{
	width: 30px;
	height: 100%;
	right: 0;
	position: fixed;
	text-align: center;
}
.information-layout{
	padding-bottom: 15px;
}
.icon-svg {
  width: 12px;
  height: 12px;
  color: #9e9e9e;
  fill:#9e9e9e;
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
