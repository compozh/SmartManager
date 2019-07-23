<template>
<div v-if="favLists">
  <v-card
    flat
    tile
  >



    <v-container
      v-for="favList in favLists"
      :key="favList.id"
      fluid
      grid-list-md
      grey
      lighten-4
    >
      <v-layout>
 
      <v-flex xs12 sm6 md3>
          <v-text-field 
            :label="favList.caption"
            v-model="favList.caption"
            solo
            @input="mutationEditFavList(favList)"
          ></v-text-field>
        </v-flex>

        <v-flex>
            <v-switch 
            v-model="favList.isDefaultList"
            label="По умолчанию"             
            @change="mutationEditFavList(favList)"

          ></v-switch>
        </v-flex >
        <v-flex>
          <v-btn flat small color="error" @click="mutationDeleteFavList(favList)">Delete List</v-btn>
        </v-flex >
      </v-layout>
      <v-layout row wrap>
        <v-flex
          v-for="card in favList.keyValues"
          :key="card"
          xs12
          sm6
          md4
        >
          <v-card @drag="ondrag()">
            <v-flex  xl4 lg9 md8 sm7 xs6>
              <v-subheader>{{ card }}</v-subheader>
            </v-flex >
            <v-flex>
              <remove-button-icon  @click="mutationDeleteItemFromFav(favList, card)"/>
            </v-flex >
            <v-img
              :src="`https://picsum.photos/200/300?image=${getImage()}`"
              height="300px"
            >
              <span
                class="headline white--text pl-3 pt-3"
                v-text="card.title"
              ></span>
            </v-img>

            <v-card-actions class="white justify-center">
              <v-btn
                v-for="(social, i) in socials"
                :key="i"
                :color="social.color"
                class="white--text"
                fab
                icon
                small
              >
                <v-icon>{{ social.icon }}</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-card>
    </div>
</template>

<script>

import {PurchasesApi} from "../api/purchasesApi";
const api = new PurchasesApi();

  export default {
     name: "mylist",
     props: ["favLists"],
    data: () => ({
      
      //favLists: [],
      socials: [
        {
          icon: 'fab fa-facebook',
          color: 'indigo'
        },
        {
          icon: 'fab fa-linkedin',
          color: 'cyan darken-1'
        },
        {
          icon: 'fab fa-instagram',
          color: 'red lighten-3'
        }
      ]
    }),
    beforeCreate() {
      api.getFavLists();
    },
    created() {
      
        this.$store.watch(state => state.purchases.favlists.keyValues, this.checkInFavourite);
        this.checkInFavourite();
        //this.types = ['Places to Be', 'Places to See2'];
    },
    methods: {
      getImage () {
        const min = 530
        const max = 560

        return Math.floor(Math.random() * (max - min + 1)) + min
      },
      favClick(){
          var test = api.addToFavoritesMutation(this.alias, this.keyValue.toString());
          //setTimeout()
          this.inFavourite = true;
      },
      ondrag(){debugger;},
      mutationDeleteFavList(favList){
        debugger;
        api.mutationDeleteFavList(favList);
      },
      mutationDeleteItemFromFav(favList, keyValue){

      },
      mutationEditFavList(favList){
        api.mutationEditFavList(favList);
      },
      checkInFavourite(){
          const favlists = this.$store.state.purchases.favLists;
          debugger;
          if(favlists != null)
          {
            
            this._props.favLists = [];
            favlists.forEach(w=>this._props.favLists.push(w));
            /*
            var i;
            for (i = 0; i < favlists.length; i++) { 
                this._props.favLists.push(favlists[i]);
            }
            */
          }
          
        }
    }
  }
</script>
