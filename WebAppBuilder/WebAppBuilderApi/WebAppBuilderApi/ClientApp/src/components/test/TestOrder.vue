<template>
  <v-container>
    <v-layout>
      <v-flex xs6 offset-xs3>
        <v-card class="item-card">
          <v-card-title >
            <div class="subtext">
              <span class="grey--text">id: {{order.id}}</span>
              <div class="headline">{{order.name}}</div>
            </div>
          </v-card-title>
        </v-card>
        <v-card class="item-card" v-for="i of order.itemLinks">
          <v-card-title >
            <div class="subtext">
              <span class="grey--text">id: {{i.item.id}}</span>
              <div class="headline">{{i.item.name}}</div>
            </div>
          </v-card-title>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
export default {
  name:"test-order",
   data: function() {
    return {
      loaded: false
    };
  },
  computed: {
    order: function() {
      return this.loaded
        ? this.$store.state.appData["test-order"].data._orders.orders[0]
        : [];
    }
  },
 beforeMount: function() {
    this.$store.commit("setAppData", { key:"currentPage", data:"Заказ #"+this.$route.params.orderid})

    this.$store
      .dispatch("LoadDataForComponent", {
        datasource: {
          schema: "_test",
          query: `
{
  _orders{
    orders(id:"${this.$route.params.orderid}"){
      id
      name
      itemsLink{
        count
        item{
          id
          name
        }
      }
    }
  }
}`
        },
        key: "test-order"
      })
      .then(() => {
        this.loaded = true;
      });
  }
}
</script>


