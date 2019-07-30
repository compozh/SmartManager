<template>
    <transition name="modal">
        <div v-if = "show">
         <div class="overlay" @click.self="show = false;">
          <div class="modal">
            <v-container>
                <v-layout row>
                    <v-flex>
                        <v-card>
                            <v-list two-line >
                                <header> {{caption}} </header>
                                <template v-for="(item) in items">
                                    <v-list-tile
                                    :key="item.Title"
                                    >
                                    <v-list-tile-content>
                                        <v-list-tile-title v-html="item.Title" @click="onChose(item.Key)"></v-list-tile-title>
                                    </v-list-tile-content>
                                    </v-list-tile>
                                </template>
                            </v-list>
                        </v-card>
                    </v-flex>
                </v-layout>
            </v-container>   
             </div>
             </div>
        </div>
    </transition>
</template>


<script>

export default {
    name: "options-selector",
    data () {
        return {
            show: false,
            items: this.$store.state.purchases.chose.list,
            caption: ""
        }
    },
    created: function () {
            this.$store.watch(state => state.purchases.chose, this.create);
        },
    methods:{
        onChose(key){
                this.show = false;
                this.$store.state.purchases.chose.method(key);
        },
        create(){
            const list = this.$store.state.purchases.chose.list;
            if (list.length  > 0) 
            {
                this.items = list;
                this.caption = this.$store.state.purchases.chose.caption;
                this.show = true;
               // this.$store.commit("purchases/setChoseList", []);
            }
        }
    }
}
</script>

<style lang="scss">
  .v-dialog{
  box-shadow: none;
  }
</style>

<style lang="scss" scoped>

.modal {  
  margin: 0px auto;
  padding: 100px;
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
    padding: 100px;
}
.resource-group-text{
  background-color: blanchedalmond
}
.card-actions-elements{
  inline-size: 50em
}
.rounded-card{
    border-radius:50px;
    margin: 1px;
}
</style>

