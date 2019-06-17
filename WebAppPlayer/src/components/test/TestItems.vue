<template>
  <v-container>
    <v-layout>
      <v-flex xs6 offset-xs3>
        <v-card class="item-card" v-for="(i, ind) of items">
          <v-card-title v-bind:key="ind">
            <div class="subtext">
              <span class="grey--text">id: {{ i.id }}</span>
              <div class="headline">{{ i.name }}</div>
              <span class="grey--text"
                >Продано {{ i.ordersLink.reduce((a, b) => a + b.count, 0) }} шт.</span
              >
            </div>
            <router-link :to="{ name: '_ORDERS', query: { item: i.id } }">
              <div class="subinfo">
                <div class="">Всего заказов:</div>
                <span class="grey--text">{{ i.ordersLink.length }}</span>
              </div>
            </router-link>
          </v-card-title>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
export default {
  name: 'test-items',
  data: function() {
    return {
      loaded: false
    }
  },
  computed: {
    items: function() {
      return this.loaded ? this.$store.state.WebApps.appData['test-items'].data._orders.items : []
    }
  },

  beforeMount: function() {
    this.$store.commit('WebApps/setAppData', { key: 'currentPage', data: 'Список товаров' })
    this.$store
      .dispatch('WebApps/LoadDataForComponent', {
        datasource: {
          schema: '_test',
          query: `
query Query{
  _orders{
    items{
      name
      id
      ordersLink{
        count
        order{
          id
        }
      }
    }
  }
}`
        },
        key: 'test-items'
      })
      .then(() => {
        this.loaded = true
      })
  }
}
</script>
<style>
.subtext {
  text-align: left;
  flex-grow: 1;
}
.item-card {
  margin: 30px 0;
}
</style>
