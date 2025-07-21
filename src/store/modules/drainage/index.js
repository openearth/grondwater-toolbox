import saveDataToJson from '@/lib/save-data-to-json';
import { v4 as uuid } from 'uuid';
import getDrainageData from '@/lib/get-drainage-data';

const initialState = () => ({
  drainageSum: null,
  drainageConfigurations: [],
});

export default {
  namespaced: true,

  state: () => initialState(),

  getters: {
    drainageSum: (state) => state.drainageSum,
    drainageConfigurations: (state) => state.drainageConfigurations,
  },

  mutations: {
    ADD_DRAINAGE_DATA(state, drainage) {
      state.drainageSum = drainage;
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
          drn_res: 10,
          drn_bodh: 2.5,
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
    EDIT_DRAINAGE_CONFIGURATION_NAME(state, { selection, name }) {
      const configuration = state.drainageConfigurations.find(config => config.selection === selection);
      if (configuration) {
        configuration.name = name;
      } 
    },
    REMOVE_DRAINAGE_CONFIGURATION(state, { selection }) {
      state.drainageConfigurations = state.drainageConfigurations.filter(config => config.selection !== selection);
    },
    REMOVE_DRAINAGE_DATA(state) {
      state.drainageSum = null;
    },
    RESET_STATE(state) {
      Object.assign(state, initialState());
    },
  },

  actions: {
    async calculateResult({ dispatch, commit }, { featureCollection }) {
      dispatch('mapbox/setWmsLayersLoading', { isLoading: true }, { root: true });
      // const layersGrouped = await wps(data);

      const { waterstat, ...layersGrouped } = await getDrainageData(featureCollection);
      await commit('ADD_DRAINAGE_DATA', waterstat );
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
