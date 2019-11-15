import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import { light } from '@voorhoede/deltares-design-tokens';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: light.blue,
        accent: "#FF7200",
      },
      dark: {

      }
    }
  },
  icons: {
    iconfont: 'mdiSvg',
  },
});
