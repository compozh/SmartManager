<template>

    <v-list class="pt-0" dense>
      <v-divider></v-divider>
      <v-list-tile @click="" v-for="route in links" :key="route.Id"  :to="{name:route.Id}" active-class="active">
        <v-list-tile-action>
          <v-badge right overlap color="red">
            <span v-if="$eval(route.Badge)"  slot="badge" v-text="$eval(route.Badge)" />
            <v-icon>{{ route.Image }}</v-icon>
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
            var app = this.$store.state.applicationDescription;
            var sections = app.Sections||[];

            // Достаем роуты из разделов
            var links = [];
            for (let index = 0; index < sections.length; index++) {
              const section = sections[index];
              links = links.concat((section.Routes||[]).map(r=> (r.section = section)&& r))
            }
            //console.log(this.$router)
            links = [...links, ...links[1].Children, ...links[0].Children]
            console.log(links)
            return  _.orderBy(links.filter(l => !l.HideAfterLogin && l.Name), 'Sort');
        }
    },
    methods: {
    	'$eval'(expr) {
        return eval(expr)
      }
    }
}
</script>