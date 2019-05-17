<template>
  <v-container v-if="loaded">
    <v-layout>
      <v-flex xs6 offset-xs3>
        <h2>Заказ</h2>
        <v-card class="item-card">
          <v-card-title>
            <div class="subtext">
              <span class="grey--text">id: {{order.id}}</span>
              <div class="headline">{{order.name}}</div>
            </div>
          </v-card-title>
        </v-card>

        <!-- Панель добавления -->
        <v-layout row class="addToolbar">
          <h3>Перечень товаров</h3>
          <v-dialog v-model="showItemToAdd" persistent max-width="500">
            <template v-slot:activator="{ on }">
              <v-btn color="primary" dark v-on="on">Добавить</v-btn>
            </template>

            <v-card>
              <v-card-title class="headline">Добавить товар в заказ</v-card-title>
              <v-card-text>Выберите товар и укажите количество</v-card-text>
<!-- АДЭ -->
              <v-autocomplete style="margin:0 20px" v-model="itemToAdd.item" :items="items" :label="`Товар`" persistent-hint>
                 <template v-slot:item="slotProps">
                  {{ slotProps.item.name }}
                </template>
                <template v-slot:selection="slotProps">
                  {{ slotProps.item.name }}
                </template>
              </v-autocomplete>
              <v-text-field style="margin:0 20px" mask="#####" label="Количество" v-model="itemToAdd.count"></v-text-field>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="green darken-1" flat @click="onAddCancel">Отмена</v-btn>
                <v-btn color="green darken-1" flat @click="onAddApprove">Добавить</v-btn>
              </v-card-actions>
            </v-card>

          </v-dialog>
        </v-layout>



        <!-- Список товаров -->
        <v-card class="item-card" v-for="i of order.itemsLink">
          <v-card-title>
            <div class="subtext">
              <span class="grey--text">id: {{i.item.id}}</span>
              <div class="headline">{{i.item.name}}</div>
            </div>
            <span>Количество:</span>
            <v-text-field @change="itemChange(i)" mask="#####" class="itemscount" v-model="i.count"></v-text-field>
            <v-btn icon @click="deleteItem(i)">
              <v-icon>delete</v-icon>
            </v-btn>
          </v-card-title>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
export default {
  name: "test-order",
  data: function() {
    return {
      loaded: false,
      itemsloaded: false,
      showItemToAdd: false,
      itemToAdd: {
        count: 0,
        item: {
          id: undefined,
          name: undefined
        }
      }
    };
  },
  computed: {
    order: function() {
      return this.loaded
        ? this.$store.state.appData["test-order"].data._orders.orders[0]
        : [];
    },
    items: function() {
      return this.$store.state.appData["test-items"]
        ? this.$store.state.appData["test-items"].data._orders.items
        : [];
    }
  },

  methods: {
    // Изменение пункта заказа
    itemChange(ev) {
      this.$store.dispatch("LoadDataForComponent", {
        datasource: {
          schema: "_test",
          query: `
      mutation {
        _ordersMutation
        {
          orderItem(operation:UPDATE, orderItem: {orderId:${
            this.order.id
          }, itemId:${ev.item.id}, count:${ev.count} }) {
            count
          }
        }
      }`
        },
        key: "test-order-res"
      });
    },
    // Добавление пункта заказа
    onAddApprove() {
      if(!this.itemToAdd.item.id || !this.itemToAdd.count){
        return
      }
      this.showItemToAdd = false;
      this.$store.dispatch("LoadDataForComponent", {
        datasource: {
          schema: "_test",
          query: `
      mutation {
        _ordersMutation
        {
          orderItem(operation:ADD, orderItem: {orderId:${this.order.id}, itemId:${this.itemToAdd.item.id}, count:${this.itemToAdd.count} }) {
            count
          }
        }
      }`  },    key: "test-order-res" }).then(()=>{
        this.loadData();

      });;
       this.itemToAdd = {
         count: 0,
         item: {
           id: undefined,
           name: undefined
         }
       }
    },

    // отмена добавления
    onAddCancel(){
      this.showItemToAdd = false;
      this.itemToAdd = {
         count: 0,
         item: {
           id: undefined,
           name: undefined
         }
       }
    },

    // Удаление заказа
    deleteItem(item){
      this.$store.dispatch("LoadDataForComponent", {
        datasource: {
          schema: "_test",
          query: `
      mutation {
        _ordersMutation
        {
          orderItem(operation:DELETE, orderItem: {orderId:${
            this.order.id
          }, itemId:${item.item.id}, count:${item.count} }) {
            count
          }
        }
      }`
        },
        key: "test-order-res"
      }).then(()=>{
        this.loadData();

      });
    },


    // Загрузка данных
    loadData(){
      this.loaded = false;
 this.$store
      .dispatch("LoadDataForComponent", {
        datasource: {
          schema: "_test",
          query: `{
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
  },

// действие при загрузке страницы
  beforeMount: function() {
    this.$store.commit("setAppData", {
      key: "currentPage",
      data: "Заказ #" + this.$route.params.orderid
    });

    // товары
    if (!this.$store.state.appData["test-items"]) {
      this.$store.dispatch("LoadDataForComponent", {
        datasource: {
          schema: "_test",
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
        key: "test-items"
      }).then(()=>{ this.itemsloaded = true;});
    }

    // заказы
   this.loadData();
  }
};
</script>
<style>
.itemscount {
  flex-grow: 0;
  flex-basis: 30px;
  margin: 0 20px;
}
.addToolbar {
  align-items: center;
}
.addToolbar h3 {
  flex-grow: 1;
  text-align: left;
}
</style>



