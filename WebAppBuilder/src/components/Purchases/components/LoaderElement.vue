<template>
    <div v-if="show" id="loader"></div>
</template>

<script>
    export default {
        name: "loader-element",
        data () {
            return {
                show: false
            }
        },
        created: function () {
            this.$store.watch(state => state.purchases.resourceGroups, this.callBack);
            this.$store.watch(state => state.purchases.resources, this.callBack);
        },
        methods:{
            callBack(){
                    const data0 = this.$store.state.purchases.resourceGroups;
                    const data1 = this.$store.state.purchases.resources;
                    if (data0.length == 0 && data1.length == 0) {
                        this.show = true;
                    }else{
                        this.show = false;
                    }
                }
        }
    }
</script>

<style>
    
    #loader {
      position: absolute;
      top: 50%;
      left: 50%;
      margin-left: -10vmin;
      margin-top: -10vmin;
      height: 20vmin;
      width: 20vmin;
      border-radius: 50%;
      border: 1vmin solid rgb(200, 201, 202);
      border-top-color: #7c9e86;
      animation: spin 2s infinite linear;
    }

    @keyframes spin {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }

</style>

