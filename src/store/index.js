import Vue from 'vue';
import Vuex from 'vuex';
import selections from './selections';
import mapbox from './mapbox';

Vue.use(Vuex);

export default new Vuex.Store({
  actions: {
    reset({ commit }) {
      commit('mapbox/reset');
      commit('selections/reset');
    }
  },
  modules: {
    selections,
    mapbox
  }
});
