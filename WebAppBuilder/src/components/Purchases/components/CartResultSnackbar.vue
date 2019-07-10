<template>
    <v-layout>
    <v-snackbar
        v-model="snackbar"
        bottom
        right
        color="success"
        :timeout="timeout"
        >
        {{text}}
        <v-btn
          color="white"
          flat
          @click="close_open">
          Close
        </v-btn>
      </v-snackbar>
    <v-btn
          block
          color="primary"
          dark
          @click="close_open">
          Show Snackbar
    </v-btn>
    
    </v-layout>
</template>

<script>
    export default {
        name: "cart-result-snackbar",
        data () {
            return {
                snackbar: false,                
                timeout: 60000,
                text: 'Item was added.'
            }
        },
        methods:{
            close_open(){
                this.snackbar = !this.snackbar;
            }
        }
    }
</script>



<style scoped>
    .v-snack {
        position: fixed;
    }
</style>