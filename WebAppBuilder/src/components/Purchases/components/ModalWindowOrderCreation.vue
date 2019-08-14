<template>
  <div>
    <transition name="modal">
      <div v-if="isOpen">
        <div class="overlay" @click.self="isOpen = false;">
          <div class="modal">
            <v-container>
              <v-form title="Формирование заказа">
              <v-layout row wrap>        
                  <v-btn  @click.self="isOpen = false;" icon light>
                    <v-icon  @click.self="isOpen = false;" color="grey darken-2">arrow_back</v-icon>
                  </v-btn>
                <v-flex sm12 xs12>
                  <v-text-field v-model="order.NDM" :label="$t('purchases.CreateOrderWindow.DocumentNumber')" placeholder="NDM"/>
                </v-flex>
                <v-flex sm12 xs12>
                  <v-dialog/>
                </v-flex>
                <v-flex sm12 xs12>
                  <!-- <div>
                  <v-text-field :label="$t('purchases.CreateOrderWindow.DocumentDate')" readonly  class="date-input"
                  append-icon="event"  @click:append="dialog = true"
                  :value="order.DDM | formatDate"/>
                  <v-dialog class="date-dialog" v-model="dialog" persistent>
                    <v-date-picker class="date-dialog" v-model="order.DDM" no-title scrollable>
                      <v-spacer></v-spacer>
                    <v-btn flat color="primary" @click="dialog = false; callBack()">OK</v-btn>
                    </v-date-picker>
                  </v-dialog>
        
                </div> -->
                <date-text-field :dateType="order" fieldName="DDM" :labelName="$t('purchases.CreateOrderWindow.DocumentDate')" editable="true"/>
                </v-flex>
                <v-flex sm12 xs12>
                  <v-select v-model="order.DM1" :label="$t('purchases.CreateOrderWindow.Code')" placeholder="DM1"></v-select>
                </v-flex>
                <v-flex sm12 xs12>
                  <v-select v-model="order.DM2" :label="$t('purchases.CreateOrderWindow.Code')" placeholder="DM2"></v-select>
                </v-flex>
                <v-flex sm12 xs12>
                  <v-textarea v-model="order.Description" :label="$t('purchases.CreateOrderWindow.Description')"></v-textarea>
                </v-flex>
                <v-flex sm12 xs12>
                  <v-btn @click="submitOrder()" block outline round color="success">{{ $t('purchases.CreateOrder')}}</v-btn>
                </v-flex>
              </v-layout>
              </v-form>
            </v-container>
          </div>
        </div>
      </div>
    </transition>
    <v-btn block outline round large color="success" @click="isOpen = !isOpen;">{{ $t('purchases.CreateOrder')}}</v-btn>
  </div>
</template>

<script>
import DateTextField from "../components/DateTextField.vue";
import {PurchasesApi} from "../api/purchasesApi";

const api = new PurchasesApi();

export default {
  
  name: "btn-modal-window-order-creation",
  data: function() {
    return {
      dialog: false,
      isOpen: false,
      order:{
        NDM:              new String(),
        DDM:              new Date().toISOString().substr(0, 10),
        DM1:              new String(),
        DM2:              new String(),
        Description:      new String()
      }      
    };
  },  
  methods: {    
    callBack(){
      this.$emit('onChangeValue', this.order.DDM);
    },
    submitOrder(){
      api.createOrderMutation(this.order);
      this.isOpen = false;
    },
  },
};
</script>

<style lang="scss">
  .v-dialog{
  box-shadow: none;
  }
</style>

<style lang="scss" scoped>

.modal {  
  margin: 0px auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px 3px;
  transition: all 0.2s ease-in;
  font-family: Helvetica, Arial, sans-serif;
}
.fadeIn-enter {
  opacity: 0;
}

.fadeIn-leave-active {
  opacity: 0;
  transition: all 0.2s step-end;
}

.fadeIn-enter .modal,
.fadeIn-leave-active.modal {
  transform: scale(1.1);
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: #00000094;
  z-index: 999;
  transition: opacity 0.2s ease;
}

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