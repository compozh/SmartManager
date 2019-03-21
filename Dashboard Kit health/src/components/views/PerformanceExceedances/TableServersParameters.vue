<template>
  <material-card color="#48a420" icon>
    
    <template slot="header" ><h4 class="server-header">{{headTitle}}<i class="material-icons icon-info" :title="info">info</i> </h4></template>
    <v-data-table
      :headers="headersError"
      :items="commonArray"
      hide-actions
      style="height:506px; overflow:auto;"
      class="container-v-data-table"
    >
      <template slot="no-data">
        <p class="empty-data-in-table">{{emptyData}}</p>
      </template>

      <template slot="headerCell" slot-scope="{ header }">
        <span
          class="font-weight-light text-warning text--darken-3 text-head-color"
          v-text="header.text"
          :title="header.text"
        />
      </template>
      <template slot="items" slot-scope="{ item }">
        <td class="text-xs-left">{{ item.ServerName }}</td>
        <td class="text-xs-left">{{ ConvertData(item.Date) }}</td>
        <td class="text-xs-left">{{ item.Port }}</td>
        <td class="text-xs-left" :class="SetBackgraundColor(item.CPU_USED.m)">{{ item.CPU_USED.v }}</td>
        <td
          class="text-xs-left"
          :class="SetBackgraundColor(item.HDD_QUEUE.m)"
        >{{ item.HDD_QUEUE.v }}</td>
        <td
          class="text-xs-left"
          :class="SetBackgraundColor(item.HDD_SECRD.m)"
        >{{ item.HDD_SECRD.v }}</td>
        <td
          class="text-xs-left"
          :class="SetBackgraundColor(item.HDD_SECWR.m)"
        >{{ item.HDD_SECWR.v }}</td>
        <td class="text-xs-left" :class="SetBackgraundColor(item.RAM_FREE.m)">{{ item.RAM_FREE.v }}</td>
        <td
          class="text-xs-left"
          :class="SetBackgraundColor(item.RAM_PGSEC.m)"
        >{{ item.RAM_PGSEC.v }}</td>
      </template>
    </v-data-table>
  </material-card>
</template>

<script>
import UnionServer from "../../../utils/CommonServerParams.js";
import moment from "moment";
export default {
  data() {
    return {
      headTitle: "",
      emptyData:
        "Нет данных за " +
        moment(this.$store.getters.getInfoList.Date).format("DD.MM.YYYY"),
      commonArray: [],
      headersError: [],
    };
  },
  computed: {
    serversParameters() {
      return this.$store.getters.getInfoList
        .ServersParametersWithExceedancesForDate;
    },
    perfExceedances() {
      return this.$store.getters.getInfoList.PerfExceedancesForDate;
    },
    detailPerfExcTable() {
      return this.$store.getters.getDetailPerfExece;
    },
    title() {
      return (
        "Превышения показателей производительности за " +
        moment(this.$store.getters.getInfoList.Date).format("DD.MM.YYYY")
      );
    },
    info() {
      return this.$store.getters.getInfoList.TitleOfPerfExcForDateLong;
    }
  },
  methods: {
    SetBackgraundColor(val) {
      switch (val) {
        case 1:
          return "norms";
          break;
        case 2:
          return "warnings";
          break;
        case 3:
          return "errors";
          break;
        default:
          break;
      }
    },
   
    ConvertData(str) {
      var number = parseInt(str.replace(/\D+/g, ""));
      var formattedDate = moment(number).format("HH:mm:ss");
      return formattedDate;
    },
    GetPerfExceedances(PerfExceedanseParams, serverParams) {
      this.commonArray = [];
      this.headTitle = this.title;
      this.SetHeaders();
      var data = UnionServer(PerfExceedanseParams, serverParams);
      for (var k in data) {
        this.commonArray.push(data[k]);
      }
    },
    SetDetailPerfExcTable(PerfExceedanseParams, serverParams) {
      this.commonArray = [];
      this.headTitle = this.detailPerfExcTable.Title;
      var data = UnionServer(PerfExceedanseParams, serverParams);
      for (var k in data) {
        this.commonArray.push(data[k]);
      }
    },
    SetHeaders(){
      this.headersError.splice(0,this.headersError.length);

      var obj=[
        {
          sortable: true,
          text: "Сервер",
          value: "ServerName",
          align: "left",
          width: "80px"
        },
        {
          sortable: true,
          text: "Время",
          value: "Date",
          align: "left",
          width: "80px"
        },
        {
          sortable: true,
          text: "Порт",
          value: "Port",
          align: "left",
          width: "50px"
        },
        {
          sortable: true,
          text: "% Использования процессора",
          value: "CPU_USED.v",
          align: "left",
          width: "50px",
          class: "classColumnHeader",
        },
        {
          sortable: true,
          text: "Очередь диска",
          value: "HDD_QUEUE.v",
          align: "left",
          width: "50px",
        },
        {
          sortable: true,
          text: "Время чтения с жесткого диска (мс)",
          value: "HDD_SECRD.v",
          align: "left",
          width: "50px",
        },
        {
          sortable: true,
          text: "Время записи на жесткий диск (мс)",
          value: "HDD_SECWR.v",
          align: "left",
          width: "50px",
        },
        {
          sortable: true,
          text: "Свободно ОЗУ (Гб)",
          value: "RAM_FREE.v",
          align: "left",
          width: "50px",
        },
        {
          sortable: true,
          text: "Обмен памяти с диском (страниц/сек)",
          value: "RAM_PGSEC.v",
          align: "left",
          width: "80px",
        }
      ]

      this.headersError=obj

    }
  },
  watch: {
    perfExceedances: function() {
      this.GetPerfExceedances(this.perfExceedances, this.serversParameters);
    },
    detailPerfExcTable: function() {
      this.SetDetailPerfExcTable(
        this.detailPerfExcTable.DetailInfoAboutTest.PerfExceedancesForDate,
        this.detailPerfExcTable.DetailInfoAboutTest
          .ServersParametersWithExceedancesForDate
      );
    }
  }
};
</script>

<style scoped>
/* .v-card>>>.title{
  line-height: 1em !important
} */
.icon-info {
  cursor: help;
  padding-left: 10px;
}
.norms {
  background: rgba(42, 255, 14, 0.2);
}
.warnings {
  background: rgba(253, 238, 27, 0.2);
}
.errors {
  background: rgba(223, 12, 12, 0.2);
}
.text-head-color {
  color: #48a420 !important;
}
.text-td-position {
  text-align: center;
}

.container-v-data-table >>> table {
  table-layout: fixed !important;
}
.container-v-data-table >>> table .column {
  text-overflow: ellipsis !important;
  overflow: hidden !important;
  width: auto;
}

.server-header{
  display: flex;
  margin-bottom: 10px;
  margin-top: 0;
}
</style>
    