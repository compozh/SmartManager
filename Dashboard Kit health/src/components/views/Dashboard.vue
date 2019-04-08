<template>
  <v-container fill-height fluid grid-list-xl class="all-page">
    <v-layout wrap>
      <v-layout align-center justify-center row fill-height v-if="!loginStatus">
        <login></login>
      </v-layout>
      <v-layout wrap v-show="loginStatus " :class="blockedWindow && !blocked?'blocked':blocked=true">
        <v-flex sm6 xs12 md6 lg2 class="card" @click="WhoCardBeShowNow(whoShowNow.errors)">
          <card-total-count-errors-today
            class="card-component"
            :class="showCard==whoShowNow.errors ?'elevation-10':'elevation-0'"
          ></card-total-count-errors-today>
        </v-flex>

        <v-flex sm6 xs12 md6 lg3 class="card" @click="WhoCardBeShowNow(whoShowNow.queries)">
          <card-total-count-queries-for-today
            class="card-component"
            :class="showCard==whoShowNow.queries ?'elevation-10':'elevation-0'"
          ></card-total-count-queries-for-today>
        </v-flex>

        <v-flex sm6 xs12 md6 lg2 class="card" @click="WhoCardBeShowNow(whoShowNow.webRequest)">
          <card-total-count-of-web-request-escalations-for-today
            class="card-component"
            :class="showCard==whoShowNow.webRequest ?'elevation-10':'elevation-0'"
          ></card-total-count-of-web-request-escalations-for-today>
        </v-flex>

        <v-flex sm6 xs6 md6 lg2 class="card" @click="WhoCardBeShowNow(whoShowNow.scheduler)">
          <card-total-count-of-scheduler-fail
            class="card-component"
            :class="showCard==whoShowNow.scheduler ?'elevation-10':'elevation-0' "
          ></card-total-count-of-scheduler-fail>
        </v-flex>

        <v-flex
          sm6
          xs6
          md6
          lg3
          class="card"
          @click="WhoCardBeShowNow(whoShowNow.perfomanceExceedances)"
        >
          <card-total-count-of-perfomance-exceedances-for-today
            class="card-component"
            :class="showCard==whoShowNow.perfomanceExceedances ?'elevation-10':'elevation-0'"
          ></card-total-count-of-perfomance-exceedances-for-today>
        </v-flex>
        <v-flex
          md12
          sm12
          lg12
          :class="showCard==whoShowNow.perfomanceExceedances ?'':'diagram-none'"
        >
          <performance-component class="container-component"></performance-component>
        </v-flex>
        <v-flex md12 sm12 lg12 :class="showCard==whoShowNow.webRequest ?'':'diagram-none'">
          <webescalation-component class="container-component"></webescalation-component>
        </v-flex>

        <v-flex md12 sm12 lg12 :class="showCard==whoShowNow.errors ?'':'diagram-none'">
          <div>
            <errors-component class="container-component"></errors-component>
          </div>
        </v-flex>

        <v-flex md12 sm12 lg12 :class="showCard==whoShowNow.queries ?'':'diagram-none'">
          <div>
            <longsql-component class="container-component"></longsql-component>
          </div>
        </v-flex>

        <v-flex md12 lg12 :class="showCard==whoShowNow.scheduler ?'':'table-none'">
          <scheduler-component class="container-component"></scheduler-component>
        </v-flex>
      </v-layout>
      <Spinner
        name="ball-spin-fade-loader"
        color="#008ffb"
        v-show=" preLoading"
        class="preloader"
      />
      <div v-show="blockedWindow" class="blocked-window"></div>
    </v-layout>
  </v-container>
</template>

<script>
import _ from "lodash";
import CErrorComponent from "./Errors/ErrorsComponent";
import CLongSqlComponent from "./LongSql/LongSqlComponent";
import CPerformanceComponent from "./PerformanceExceedances/PerformanceComponent";
import CSchedulerFailComponent from "./SchedulerFail/SchedulerFailComponent";
import CWebEscalationComponent from "./WebEscalations/WebEscalationComponent";

import CTotalCountOfLongQueriesForToday from "./LongSql/CardTotalCountOfLongQueriesForToday";
import CTotalCountErrorsToday from "./Errors/CardTotalCountErrorsToday";
import CTotalCountOfWebRequestEscalationsForToday from "./WebEscalations/CardTotalCountOfWebRequestEscalationsForToday";
import CTotalCountOfPerformanceExceedancesForToday from "./PerformanceExceedances/CardTotalCountOfPerformanceExceedancesForToday";
import CTotalCountOfSchedulerFail from "./SchedulerFail/CardTotalCountOfSchedulerFail";
import Login from "./Login";
import ApexCharts from "apexcharts";

export default {
  components: {
    "card-total-count-queries-for-today": CTotalCountOfLongQueriesForToday,
    "card-total-count-errors-today": CTotalCountErrorsToday,
    "card-total-count-of-web-request-escalations-for-today": CTotalCountOfWebRequestEscalationsForToday,
    "card-total-count-of-perfomance-exceedances-for-today": CTotalCountOfPerformanceExceedancesForToday,
    "card-total-count-of-scheduler-fail": CTotalCountOfSchedulerFail,
    "errors-component": CErrorComponent,
    "longsql-component": CLongSqlComponent,
    "performance-component": CPerformanceComponent,
    "scheduler-component": CSchedulerFailComponent,
    "webescalation-component": CWebEscalationComponent,
    login: Login // Объявляю  компонент логина
  },
  data() {
    return {
      blocked: true,
      whoShowNow: {
        errors: 1,
        longQuery: 2,
        webRequest: 3,
        scheduler: 4,
        perfomanceExceedances: 5
      },
      whoShowIframe: {},
      stateSwitch: false,
      typeDiagram: "Bar"
    };
  },
  computed: {
    loginStatus() {
      return this.$store.getters.getLoginStatus;
    },
    preLoading() {
      return this.$store.getters.getPreLoading;
    },
    showCard() {
      return this.$store.getters.getCardIsShow;
    },
    blockedWindow() {
      return this.$store.getters.getBlockedwindow;
    },
    isDetail(){
      return this.$store.getters.getIsDetail
    }
  },
  methods: {
    WhoCardBeShowNow(val) {
      this.$store.dispatch("WhoCardShowNow", val);
    }
  },
  created: function() {
    if (localStorage.getItem("authToken")) {
      this.$store.dispatch("IsLogin", true);
    } else {
      this.$store.dispatch("IsLogin", false);
    }
  }
};
</script>
<style scoped>
.blocked {
  display: none;
}
.preloader {
  position: fixed !important;
  top: 50% !important;
  left: 50% !important;
}
.card {
  margin-top: 25px;
  height: 170px;
}
.card-component {
  cursor: pointer;
}
.wrapDiagram {
  background: white;
  text-align: center;
  color: #999;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.14);
  border-radius: 3px;
  margin-top: 20px !important;
}
.all-page {
  margin-top: 60px;
}
.login-div {
  width: 100%;
  height: 100%;
  background-color: white;
  border-radius: 10px;
}
g {
  position: relative;
  z-index: 1000;
}
.card-none {
  visibility: hidden;
}
.diagram-none {
  display: none;
}
.table-none {
  display: none;
}
.v-card {
  margin-top: 20px !important;
}
.blocked-window {
  position: fixed;
  z-index: 1000;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(52, 144, 254, 0.1);
}
.container-component{
  padding-left: 0;
    padding-right: 0;
    margin-left: 0;
    margin-right: 0;
    max-width: 100%;
}

</style>

