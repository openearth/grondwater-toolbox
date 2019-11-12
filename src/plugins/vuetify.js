import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: "#008FC5",
        accent: "#FF7200",
      }
    }
  },
  icons: {
    iconfont: 'mdiSvg',
  },
});
