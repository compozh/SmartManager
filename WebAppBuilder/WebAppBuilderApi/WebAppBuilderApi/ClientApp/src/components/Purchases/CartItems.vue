<template>
  <v-layout column>
    <v-layout row>
      <v-btn block outline round large color="success" :disabled="!cartlist" @click="mutationSubmit" >Сформировать заказ</v-btn>
      &nbsp;
      <v-btn block outline round large color="error" :disabled="!cartlist" @click="mutationClearCart" >Очистить корзину</v-btn>
    </v-layout>
    <div v-if="cartlist" >
      <v-card v-for="cartItem in cartlist" :key="cartItem.id" class="rounded-card" >
        <v-layout v-bind="cardBinding">
            <!-- Картинка ресурса -->
          <v-flex align-center justify-center hidden-xs-only resource-card-pic>
              <img src="https://baxov.net/sites/default/files/2018-03/ima23ge_2.png" width="100px" />
          </v-flex>
            <!-- Заголовок, имя ресурса -->
          <v-flex xl9 lg9 md8 sm7 xs6 align-center justify-start resource-cartion>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <span v-on="on">
                  <h3>
                    <span class="resource-group-text">[{{cartItem.resource.resourceGroup.name | truncate(getTextLength(20,20,40,40,40), '...')}}]</span>
                    {{cartItem.resource.name | truncate(getTextLength(100,80,200,500,500), '...')}}
                  </h3>
                </span>
              </template>
              <span class="hidden-lg-and-up">
                <span>{{cartItem.resource.name}}</span><br/>
                <img class="hidden-sm-and-up" src="https://baxov.net/sites/default/files/2018-03/ima23ge_2.png" width="100px" />
              </span>
            </v-tooltip>
          </v-flex>
          <v-flex xl3 lg3 md4 sm5 xs6>
            <!-- Основные параметры заказа -->
            <v-card-actions>
              <v-layout column card-actions-elements>

                <!-- Количество и ЕИ -->
                <v-layout align-start>
                    <v-text-field
                      :value="cartItem.quantity" 
                      prepend-inner-icon="add" 
                      @click:prepend-inner="mutationChangeQuantity(cartItem, MUTATION_TYPE.PLUS)"
                      append-icon="remove" 
                      @click:append="mutationChangeQuantity(cartItem, MUTATION_TYPE.MINUS)"
                      label="Количество"
                      />
                    &nbsp;
                    &nbsp;
                    &nbsp;
                    <v-autocomplete
                        v-model="cartItem.measurementUnit"
                        :loading="loading"
                        :items="[...items, cartItem.measurementUnit]"
                        :search-input.sync="search"
                        cache-items
                        hide-no-data
                        hide-details
                        label="Единица измерения"
                        return-object
                        item-text="name"
                      />
<!--                        item-value="id"  
                        item-text="name"  
                        :items="items"
-->
                </v-layout>

                <!-- Дата поставки -->
                <v-layout align-start>
                  <v-flex>
                    <v-text-field label="Дата поставки" readonly 
                    prepend-inner-icon="event"
                    append-icon="edit"  @click:append="dialog = true"
                    :value="cartItem.dateDelivery"/>
                    <v-dialog v-model="dialog" persistent max-width="290">
                        <v-date-picker v-model="cartItem.dateDelivery" no-title scrollable>
                          <v-spacer></v-spacer>
                          <v-btn flat color="primary" @click="dialog = false;">OK</v-btn>
                        </v-date-picker>
                    </v-dialog>
                  </v-flex>
                </v-layout>

              </v-layout>
            </v-card-actions>
          </v-flex>
        </v-layout>
      </v-card>
    </div>
  </v-layout>

</template>

<script>
import Axios from "axios";
export default {
    name: "cart-list",
    props: ["cartlist"],
    data:()=> ({
          dialog: false,
          loading: false,
          items: [],
          search: null,
          select: null,
          timeout: 0,
          MUTATION_TYPE: { 
            PLUS: 1, 
            MINUS:-1 
          }
    }),
    computed:{
      cardBinding() { 
        const binding = {}
        binding.column = !this.$vuetify.breakpoint.smAndUp
        return binding
      },
    },
    filters:{
      truncate: (text, length, clamp) => {
        clamp = clamp || '...';
        var node = document.createElement('div');
        node.innerHTML = text;
        var content = node.textContent;
        return content.length > length ? content.slice(0, length) + clamp : content;
      }
    },
    watch: {
      search (val) {
        val && val !== this.select && this.querySelections(val)
      }
    },
    methods:{
      getTextLength (p1, p2, p3, p4, p5) {
          switch (this.$vuetify.breakpoint.name) {
            case 'xs': return p1
            case 'sm': return p2
            case 'md': return p3
            case 'lg': return p4
            case 'xl': return p5
          }
        },
      breakpointIif(bp, t, f){
        if (this.$vuetify.breakpoint.name==bp)
        {
          return t;
        }
        return f;
      },
      querySelections (v) {
        this.loading = true
        // Simulated ajax query
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
        Axios({
                              method: 'POST',
                              url: myConfig.GrapgQlUrl+'api/graphql',
                              withCredentials:true,
                              headers: { 'Authorization': 'Bearer ' + localStorage.getItem('ItUniTocken')},
                              data: { 
                                SchemaName:'PurchasesSchema', 
                                query: `{purchases{measurementUnits(where:[{path:"isValid",comparison:equal,value:"true"},{path:"name",comparison:like,value:"%${v}%"}]){id,name}}}`
                              } 
                            }).then(resp => {
                      // тут обработка результата
                              //debugger;
                              //console.log( resp.data.data.purchases.measurementUnits );
                              this.items = resp.data.data.purchases.measurementUnits;
                              //console.log(resp.data) 
                            });
          this.loading = false
        }, 500)
      },
      mutationChangeQuantity(item, arg){
        //debugger;
        item.quantity += arg;

        //TODO call Axios for mutation
      },
      mutationClearCart(){

      },
      mutationSubmit(){

      }
    }
};
</script>

<style>
.resource-card-pic{
  flex-basis: 100px !important; 
  flex-shrink: 0;
  display: flex;
  padding: 10px;
}
.resource-cartion {
    display: flex;
    text-align: left;
    padding: 10px;
}
.resource-group-text{
  background-color: blanchedalmond
}
.card-actions-elements{
  inline-size: 20em
}
.card-actions-elements input{
  text-align: center;
}
.rounded-card{
    border-radius:20px;
}
</style>
