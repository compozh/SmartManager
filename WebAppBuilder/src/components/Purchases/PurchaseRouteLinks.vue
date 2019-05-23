<template>

    <v-list class="pt-0" dense>
        <v-divider></v-divider>

        <v-list-tile @click="" v-for="route in links" :key="route.Id"  :to="{name:route.Id}" active-class="active">
          <v-list-tile-action>
            <v-badge right overlap v-bind:color="route.Properties.BadgeColor">
              <span v-if="route.Properties.BadgeValue != 0"  slot="badge">{{route.Properties.BadgeValue}}</span>
              <v-icon>{{ route.Properties.Icon }}</v-icon>
            </v-badge>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title>
                <!-- <router-link  class="nav-link" > -->
                    {{ route.Name }}
                <!-- </router-link> -->
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
</template>
<script>
export default {
    name:"purchase-route-links",
    computed:{
        links(){
          //debugger
            if(!this.$store.state.applicationDescription){
                return []
            }
            //console.log(this.$router)
            var links = this.$store.state.applicationDescription.Routes;
            links = [...links, ...links[1].Children, ...links[0].Children]
            links.forEach(l=>
            {
              l.Properties = {
                  BadgeColor: "red",
                  BadgeValue: (l.Path === '' && this.$store.state.CartItems) ? this.$store.state.CartItems.len() : 0,
                  Icon: "android"
                  };
              return l;
            });
            console.log(links)
            return  _.orderBy(ret, links.filter(l =>l.Path != 'login'), 'Sort');
        }
    }
}
</script>