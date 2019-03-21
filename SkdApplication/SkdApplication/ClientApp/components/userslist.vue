<template>
  <v-layout>
    <v-flex offset-lg2 lg8 v-if="!loaded">
      <v-container align-center fill-height justify-center pt-5>
        <v-progress-circular :size="120" :width="3" color="indigo" indeterminate></v-progress-circular>
      </v-container>
    </v-flex>

    <transition name="fade">
      <div class="loading" v-show="loading">
        <span class="fa fa-spinner fa-spin"></span> Loading
      </div>
    </transition>
    <v-flex offset-lg2 lg8 v-if="loaded" id="infinite-list">
      <template v-for="user_group in SlicedItems">
        <h3>{{user_group.group}}</h3>
        <v-layout
          :key="userCom.USERID+userCom.EMAIL+userCom.P_FIO"
          v-for="userCom in user_group.users"
        >
          <list-component :userCopmonent="userCom">
            <!-- передаю "привязываю" пользовательскому компоненту  данные  -->
          </list-component>
        </v-layout>
      </template>
    </v-flex>
  </v-layout>
</template>

<script>
import LicstComponent from "./listcomponent";
export default {
  components: {
    "list-component": LicstComponent // объявляю пользовательский компонент
  },
  data() {
    return {
      loading: false
    };
  },
  computed: {
    loaded() {
      return this.$store.getters.loaded;
    },
    users_list() {
      return this.$store.getters.getGroupedUserList; //getters из vuex папка (store/index.js)
    },
    user() {
      return this.$store.getters.getUser; //getters из vuex папка (store/index.js)
    },
    ItemsOffset () {
      return this.$store.getters.getItemsOffset;
    },
    SlicedItems() {
      this.loading = true;
      let grouped;
      let itemsenp = [];
      let insideCounter = 0;
      for (var i = 0; i < this.users_list.length; i++) {
        let listUsers = [];
        for (var j = 0; j < this.users_list[i].users.length; j++) {
          listUsers.push(this.users_list[i].users[j]);
          if (insideCounter == this.ItemsOffset ) {
            break;
          }
          insideCounter++;
        }
        grouped = { group: this.users_list[i].group, users: listUsers };
        itemsenp.push(grouped);
        if (insideCounter == this.ItemsOffset ) {
          break;
        }
      }
      this.loading = false;
      return itemsenp;
    }
  },

  created: function() {
    this.$store.dispatch("loadUsersList");
  },
  mounted() {
    window.addEventListener("scroll", e => {
      if (
        window.scrollY + window.innerHeight >=
        window.document.body.scrollHeight
      ) {
        this.loadMore();
      }
    });
  },
  methods: {
    loadMore() {
      this.$store.dispatch("setItemsOffset", 20);
    }
  }
};
</script>

<style>
.search {
  background: #a5d6a7;
}

.loading {
  text-align: center;
  position: absolute;
  color: #fff;
  z-index: 9;
  background: #5c4084;
  padding: 8px 18px;
  border-radius: 5px;
  left: calc(50% - 45px);
  top: calc(50% - 18px);
}
</style>
