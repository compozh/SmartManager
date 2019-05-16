<template>
  <div v-if="menu" class="menu-container">
    <VueLogo class="all-svg"/>
    <div class="menu-list">
      <v-treeview
        :items="ItemsMenu"
        item-key="codeMenu"
        activatable
        open-on-click
        hoverable
        indeterminate-icon
        transition
        class="menu"
      >
        <template slot="label" slot-scope="{ item }">
          <router-link
            class="none-link"
            :to="{ name : 'MODULECONTENT', params : LoadModuleContent(item) }"
          >
            <svg class="svg">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#' + item.image"></use>
            </svg>
            <span class="menu-item" :title="item.name">{{ item.name }}</span>
          </router-link>
        </template>
      </v-treeview>
    </div>
    <div class="menu-content">
      <!-- Костыль -->
      <router-view name="module" v-if="this.$route.params.module"></router-view>
      <Module v-if="!this.$route.params.module"/>
    </div>
  </div>
</template>

<script>
import Module from "./ITModule";
import VueLogo from "../../svgfiles/ItIcons.svg";
import getImage from "./ConvetImage.js";

export default {
  name: "it-menu",
  components: {
    VueLogo,
    Module
  },
  props: ["menu"],
  computed: {
    ItemsMenu() {
      if (!this.SvgCollection.length) {
        return [];
      }
      for (let object of this.menu.items) {
        if (!object.children) {
          object.children = [];
        }
        if (!object.image == "") {
          object.image = object.image.toUpperCase();
        } else {
          object.image = "IT";
        }
        let inspaction = "";
        for (let child of object.children) {
          if (!child) {
            break;
          }

          child.image = getImage(child.image, this.SvgCollection);
        }
      }
      return this.menu.items;
    },
    SvgCollection() {
      return this.$store.getters.getExistedIcons;
    }
  },
  methods: {
    LoadModuleContent(item) {
      return { module: item.codeMenu };
    }
  },
  updated() {
    if (this.$store.getters.getExistedIcons.length == 0) {
      let arr = Array.from(
        document.getElementsByClassName("all-svg")[0].children
      ).map(r => r.id);
      this.$store.commit("setExistedIcons", arr);
    }
  },
  created() {}
};
</script>

<style scoped>
.menu-container {
  display: flex;
  width: 100%;
}
.menu {
  text-align: left;
}
.menu-list {
  width: 500px;
  overflow: hidden;
}
.menu-item {
  
}
.menu-content {
  display: block;
  float: left;
  width: 100%;
}
.none-link {
  color: black;
  text-decoration: none !important;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
}
.svg {
  width: 20px;
  height: 20px;
  margin-right: 5px;
  fill: #757575;
}
</style>
