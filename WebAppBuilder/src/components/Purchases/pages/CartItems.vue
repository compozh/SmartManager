<template>
  <v-layout column>
    <v-layout row>
      <v-flex sm6>
        <btn-modal-window-order-creation/>
      </v-flex>
      <!--<v-btn block outline round large color="success" :disabled="!cartlist" @click="mutationSubmit" >Сформировать заказ</v-btn>-->
      <v-flex sm6>
        <v-btn block outline round large color="error" :disabled="!cartlist" @click="mutationClearCarts" >Очистить корзину</v-btn>
      </v-flex>
    </v-layout>
    <v-layout v-if="cartlist" column class>
      <div v-for="cartItem in cartlist" :key="cartItem.id">
        <v-layout v-bind="cardBinding">
          <v-flex v-if="cartItem.resource" xl9 lg9 md8 sm7 xs6 align-center justify-start resource-caption>
              <!-- Удалить -->
            <remove-button-icon class="hidden-sm-and-down" @click="mutationDeleteCart(cartItem)"/>
              <!-- Картинка ресурса -->
            <item-picture class="hidden-sm-and-down" entityName="resources" :id="cartItem.resource.id" height="100px" width="100px"/>
              <!-- Заголовок, имя ресурса -->
            <v-flex xl11>
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
                  <item-picture class="hidden-sm-and-up" entityName="resources" :id="cartItem.resource.id" height="100px" width="100px"/>
                </span>
              </v-tooltip>
            </v-flex>
          </v-flex>

          <v-flex v-else  xl9 lg9 md8 sm7 xs6 align-center justify-start resource-caption>
              <!-- Удалить -->
            <remove-button-icon class="hidden-sm-and-down" @click="mutationDeleteCart(cartItem)" />
              <!-- Картинка ресурса -->
            <item-picture class="hidden-sm-and-down" entityName="resources" id="" height="100px" width="100px"/>
              <!-- Заголовок, имя ресурса -->
            <v-flex xl11>
              <text-area-with-lock-edit :item="cartItem" @click="mutationChangeCartItem(cartItem)" fieldName="resourceName" labelName="Наименование" disabled="true" />
            </v-flex>
          </v-flex>

          <v-flex xl3 lg3 md4 sm5 xs6>
            <!-- Основные параметры заказа -->
            <v-layout column>

              <!-- Количество и ЕИ -->
              <v-layout align-start>
                  <quantity-text-field editable="true" :quantityType="cartItem" @onChangeValue="(qt)=> mutationChangeCartItem(cartItem, qt)" />
                  &nbsp;&nbsp;&nbsp;
                  <measurement-autocomplete editable="true" :measurement="cartItem.measurementUnit" @onChangeValue="(m)=> mutationChangeCartItem(cartItem, m)" />
              </v-layout>

              <!-- Дата поставки -->
              <v-layout align-start>
                <v-flex>
                    <date-text-field editable="true" :dateType="cartItem" fieldName="dateDelivery" label="Дата поставки"  @onChangeValue="(d)=> mutationChangeCartItem(cartItem, d)"/>
                </v-flex>
              </v-layout>

            </v-layout>
          </v-flex>
        </v-layout>
        <v-divider />
      </div>
    </v-layout>
  </v-layout>

</template>

<script>
import Axios from "axios";
import purchasesSchemaAxios from "../api/BaseFunctions";
import {PurchasesApi} from "../api/purchasesApi";
import RemoveButton from "../components/RemoveButton.vue"
import ModalWindowOrderCreation from "../components/ModalWindowOrderCreation.vue"
import { debug } from 'util';

const api = new PurchasesApi();

export default {
    name: "cart-list",
    components:{
      RemoveButton,
      ModalWindowOrderCreation
    },
    computed:{
      cardBinding() { 
        const binding = {}
        binding.column = !this.$vuetify.breakpoint.smAndUp
        return binding
      },
      cartlist: {
        get: function() {
          return this.$store.getters["purchases/getCartItems"]
        },
        set: function(newVal){
          this.$store.commit('purchases/setCartItems', newVal)
        }
      }
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
      getCartInputTypeParam(cartItem){
        return {
          item:	{
            id:                 cartItem.id,
            resourceId:         cartItem.resource===null ? null : cartItem.resource.id,
            measurementUnitId:  cartItem.measurementUnit.id,
            resourceName:       cartItem.resourceName,
            quantity:           cartItem.quantity,
            dateDelivery:       cartItem.dateDelivery
          }
        }
      },
      mutationChangeCartItem(item, qt){
        const q = `
        mutation($item: CartInput!){
          purchasesMutation{
            updateCart(cart:$item){
              id,
              measurementUnit{
                id,
                name
              },
              quantity,
              resourceId,
              resourceName,
              dateDelivery
            }
          }
        }`
        var par = this.getCartInputTypeParam(item);//JSON.stringify();
        debugger;
        console.log(par);
        purchasesSchemaAxios(this, q, par).then(function(r){ console.log(r); })
      },            
      _deleteCartView(id){
        this.cartlist = _.remove(this.cartlist, function(n){
          return n.id != id;
        });
      },
      _deleteAllView(ids){
        debugger;
        this.cartlist = [];
        debugger;
      },
      mutationClearCarts(){
        const query = `
          mutation{
          purchasesMutation{
          deleteAllCarts{
          id,quantity,resourceName
            }
          }
        }
        `
        let func = this._deleteAllView;  
        purchasesSchemaAxios(this, query, null).then(function(r){
          func();
        })

      },
      mutationDeleteCart(item){
        const query = `
        mutation{
  	    purchasesMutation{
        deleteCart(cartId: "`+item.id+`"){
        id}}}`         
        
        let func = this._deleteCartView;
        purchasesSchemaAxios(this, query, null).then(function(r){
          let id = r.data.data.purchasesMutation.deleteCart.id;
          func(id);})
      },
      mutationSubmit(){

      },
      getCartItemsResponseCallback(resp){
        this.cartlist = resp.data.purchases.cartItems;
      }
    },
    created(){
      api.getCartItems().then(this.getCartItemsResponseCallback)
    }
};
</script>

<style lang="scss" scoped>
.resource-caption {
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
.rounded-card{
    border-radius:20px;
    margin: 5px;
}
</style>