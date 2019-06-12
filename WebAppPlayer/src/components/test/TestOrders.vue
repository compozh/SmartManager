<template>
  <v-container>
    <v-layout>
      <v-flex xs6 offset-xs3>
        <v-card class="item-card" v-for="i of orders">
          <v-card-title>
            <div class="subtext">
              <span class="grey--text">id: {{ i.id }}</span>
              <div class="headline">{{ i.name }}</div>
            </div>
            <router-link :to="{ name: '_ORDER', params: { orderid: i.id } }">
              <div class="subinfo">
                <div class="">Пунктов: {{ i.itemsLink.length }}</div>
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
  name: 'test-orders',
  data: function() {
    return {
      loaded: false
    }
  },
  computed: {
    orders: function() {
      return this.loaded ? this.$store.state.appData['test-orders'].data._orders.orders : []
    }
  },
  beforeMount: function() {
    this.$store.commit('setAppData', { key: 'currentPage', data: 'Список заказов' })

    this.$store
      .dispatch('LoadDataForComponent', {
        datasource: {
          schema: '_test',
          query: `
query Query{
  _orders{
    orders{
      name
      id
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
        key: 'test-orders'
      })
      .then(() => {
        this.loaded = true
      })
  }
}
</script>
