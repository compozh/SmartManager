import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    light: true,
    breakpoint: {
      scrollBarWidth: 24
    }
  },
  icons: {
    iconfont: 'mdi',
  }
});