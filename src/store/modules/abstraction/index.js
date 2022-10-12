import getAbstractionData from '@/lib/get-abstraction-data';
import { generateWmsLayer } from '@/lib/project-layers';

const initialState = () => ({
  profile: null,
});

export default {
  namespaced: true,

  state: () => initialState(),

  getters: {
    profile: state => state.profile,
  },

  mutations: {
    ADD_PROFILE(state, { profile }) {
      state.profile = profile;
    },
    REMOVE_PROFILE(state) {
      state.profile = null;
    },
  },

  actions: {
    addProfile({ commit }, { profile }) {
      commit('ADD_PROFILE', { profile });
    },
    async calculateResult({ dispatch }, { area, coordinates, layer, abstraction }) {
      dispatch('mapbox/setWmsLayersLoading', { isLoading: true }, { root: true });

      try {
        const layers = await getAbstractionData({ area, coordinates, layer, abstraction });

        const wmsLayers = layers.map(({ url, layer, name }) => ({
          ...generateWmsLayer({ url, layer, id: layer }),
          name: name,
          baseUrl: url,
        }));

        wmsLayers.forEach((layer) => dispatch('mapbox/addWmsLayer', { layer }, { root: true }));
      } catch (err) {
        console.log(err);
      }

      dispatch('mapbox/setWmsLayersLoading', { isLoading: false }, { root: true });
    },
    removeProfile({ commit }, { profile }) {
      commit('REMOVE_PROFILE', { profile });
    },
  },
};
