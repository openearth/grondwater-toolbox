import Vue from 'vue';
import Vuex from 'vuex';
import selections from './selections';
import mapbox from './mapbox';

Vue.use(Vuex);

let errorId = 0;

export default new Vuex.Store({
  state: {
    error: null
  },
  mutations: {
    setError(state, message) {
      state.error = {
        message: message,
        id: errorId
      };

      errorId++;
    }
  },
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
