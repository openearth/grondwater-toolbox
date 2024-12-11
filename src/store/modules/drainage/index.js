import saveDataToJson from '@/lib/save-data-to-json';
import wps from '@/lib/wps';

const initialState = () => ({
  data: { sum: 1 },
});

export default {
  namespaced: true,

  state: () => initialState(),

  getters: {
    drainageSum: (state) => state.data.sum,
  },

  mutations: {
    ADD_DRAINAGE_DATA(state, data) {
      state.data = data;
    },
    REMOVE_DRAINAGE_DATA(state) {
      state.data = {
        sum: null,
      };
    },
    RESET_STATE(state) {
      Object.assign(state, initialState());
    },
  },

  actions: {
    async calculateResult({ dispatch, commit }, data) {
      dispatch('mapbox/setWmsLayersLoading', { isLoading: true }, { root: true });
      const layersGrouped = await wps(data);

      // const layersGrouped = await getDrainageData({ area, coordinates, layer, abstraction });

      await commit('ADD_DRAINAGE_DATA', { sum: 12345 } );
      dispatch('mapbox/setLayers', layersGrouped, { root: true });
      dispatch('mapbox/setWmsLayersLoading', { isLoading: false }, { root: true });
    },
    reset({ commit }) {
      commit('RESET_STATE');
    },
    saveProject({ rootState, state }) {
      const { mapbox } = rootState;
      const { drainageSum } = state;

      saveDataToJson({ mapbox, drainageSum });
    },
  },
};
