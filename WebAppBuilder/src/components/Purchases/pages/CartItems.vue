<template>
  <v-container fluid>
    <v-layout :class="`${btnClass}`">
      <v-flex>
        <btn-modal-window-order-creation/>
      </v-flex>     
      <v-flex>
        <v-btn block outline round large color="error" :disabled="!cartlist" @click="mutationClearCarts" >Очистить корзину</v-btn>
      </v-flex>
    </v-layout>
    
    <v-layout v-if="cartlist" column class>
      <div v-for="cartItem in cartlist" :key="cartItem.id">
        <v-layout v-bind="cardBinding">
          <v-flex xl9 lg9 md8 sm7 xs6 align-center justify-start resource-caption>
              <!-- Удалить -->
              <v-flex hidden-sm-and-down>
                <remove-button-icon  @click="mutationDeleteCart(cartItem)"/>
              </v-flex>
              <!-- Картинка ресурса -->
              <v-flex hidden-sm-and-down>
                <item-picture entityName="resources" :id="cartItem.resource ? cartItem.resource.id : cartItem.id" height="100px" width="100px"/>
              </v-flex>
              <!-- Заголовок, имя ресурса -->
            <v-flex v-if="cartItem.resource" xs12>
              <tooltip-with-resource :cartItem="cartItem"/>
            </v-flex>
            <v-flex v-else xs12>
              <text-area-with-lock-edit :item="cartItem" @click="mutationChangeCartItem(cartItem)" fieldName="resourceName" labelName="Наименование" :disabled="true" />
            </v-flex>
          </v-flex>

          <v-flex xl3 lg3 md4 sm5 xs6>
            <!-- Основные параметры заказа -->
            <v-layout class="layout_params" column>

              <!-- Количество и ЕИ -->
              <v-layout align-start>
                  <v-flex>
                    <quantity-text-field editable="true" :quantityType="cartItem" @onChangeValue="(qt)=> mutationChangeCartItem(cartItem, qt)" />
                  </v-flex>
                  &nbsp;&nbsp;
                  <v-flex>
                    <measurement-autocomplete editable="true" :measurement="cartItem.measurementUnit" @onChangeValue="(m)=> mutationChangeCartItem(cartItem, m)" />
                  </v-flex>
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
    <v-layout row>
      <v-flex xs12 sm12 md6>          
        <v-btn @click="mutationCreateCart" color="green" dark large fixed bottom right fab>
          <v-icon>add</v-icon>
        </v-btn>
        </v-flex>
    </v-layout>
  </v-container>

</template>

<script>
import Axios from "axios";
import purchasesSchemaAxios from "../api/BaseFunctions";
import {PurchasesApi} from "../api/purchasesApi";
import RemoveButton from "../components/RemoveButton.vue"
import ModalWindowOrderCreation from "../components/ModalWindowOrderCreation.vue"
import TooltipCartItemWithResource from "../components/TooltipCartItemWithResource.vue"
import TextAreaWithLockEdit from "../components/TextAreaLockEdit.vue"
import { debug } from 'util';

const api = new PurchasesApi();

export default {
    name: "cart-list",
    components:{
      RemoveButton,
      ModalWindowOrderCreation,
      TooltipCartItemWithResource
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
      },
      btnClass(){
        var b = this.$vuetify.breakpoint.name;
        if (b==='xs'){
          return "column";
        }
        return "row";
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
            quantity:           cartItem.quantity<1 ? 1 : cartItem.quantity,
            dateDelivery:       cartItem.dateDelivery
          }
        }
      },
      // TODO
      changeQuantity(cartItem, qt){
        debugger;
        if(qt <= 0){
          alert("<1")
        }else{
          mutationChangeCartItem(cartItem)
        }
      },
      
      mutationChangeCartItem(item, qt){
        api.updateCartMutation(item);
      },

      mutationClearCarts(){
        api.deleteAllCartsMutation();
      },

      mutationDeleteCart(item){
        api.deleteCartMutation(item.id);
      },

      mutationSubmit(){
      },
      
      mutationCreateCart(){
        api.createCartMutation();
      }
    },
    created(){
      api.getCartItems();
    }
}
</script>

<style lang="scss" scoped>

.v-dialog{
  box-shadow: none !important;
}

.layout_params{
  min-height: 160px;
}
.resource-caption {
    display: flex;
    text-align: left;
    //padding: 10px;
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