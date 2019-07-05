<template>
  <div>
    <transition name="modal">
      <div v-if="isOpen">
        <div class="overlay" @click.self="isOpen = false;">
          <div class="modal">
            <v-layout column>
              <v-layout row>
                <input type="text"/>
              </v-layout>
            </v-layout>
          </div>
        </div>
      </div>
    </transition>
    <v-btn block outline round large color="success" @click="isOpen = !isOpen;"> Сформировать заказ</v-btn>
  </div>
</template>

<script>
export default {
  name: "btn-modal-window-order-creation",
  data: function() {
    return {
      isOpen: false
    };
  }
};
</script>

<style scoped>
.modal {
  width: 500px;
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