import saveDataToJson from '@/lib/save-data-to-json';
import { v4 as uuid } from 'uuid';
import getDrainageData from '@/lib/get-drainage-data';

const initialState = () => ({
  data: { sum: 1 },
  drainageConfigurations: [],
});

export default {
  namespaced: true,

  state: () => initialState(),

  getters: {
    drainageSum: (state) => state.data.sum,
    drainageConfigurations: (state) => state.drainageConfigurations,
  },

  mutations: {
    ADD_DRAINAGE_DATA(state, data) {
      state.data = data;
    },
    ADD_DRAINAGE_CONFIGURATION(state, selection) {
      if (state.drainageConfigurations.some((configuration) => configuration.selection === selection.id)) {
        return;
      }
      const defaultForm = {
        id: uuid(),
        name: selection.name || `Selectie #${ state.drainageConfigurations.length + 1 }`,
        selection: selection.id,
        valid: true,
        data: {
          buffer: '1000',
          layer: null,
          drn_cond: 10,
          drn_bodh: 2.5,
          drn_conc: 10,
          outres: 250,
        },
      };
      state.drainageConfigurations = [ ...state.drainageConfigurations, defaultForm ];
    },
    UPDATE_DRAINAGE_CONFIGURATION(state, updatedConfiguration) {
      state.drainageConfigurations = state.drainageConfigurations.map((configuration) => {
        if (configuration.id === updatedConfiguration.id) {
          return { ...configuration, ...updatedConfiguration };
        }
        return configuration;
      });
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
    async calculateResult({ dispatch, commit }, { featureCollection }) {
      dispatch('mapbox/setWmsLayersLoading', { isLoading: true }, { root: true });
      // const layersGrouped = await wps(data);

      const layersGrouped = await getDrainageData(featureCollection);
      console.log(layersGrouped);
      await commit('ADD_DRAINAGE_DATA', { sum: 12345 });
      dispatch('mapbox/setLayers', layersGrouped, { root: true });
      dispatch('mapbox/setWmsLayersLoading', { isLoading: false }, { root: true });
    },
    addDrainageConfiguration({ commit }, configuration) {
      commit('ADD_DRAINAGE_CONFIGURATION', configuration);
    },
    updateDrainageConfiguration({ commit }, configuration) {
      commit('UPDATE_DRAINAGE_CONFIGURATION', configuration);
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
