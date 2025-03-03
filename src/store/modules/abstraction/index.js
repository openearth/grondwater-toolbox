import getAbstractionData from '@/lib/get-abstraction-data';
import { generateWmsLayer } from '@/lib/project-layers';
import mapChartData from '@/lib/map-chart-data';
import saveDataToJson from '@/lib/save-data-to-json';

const initialState = () => ({
  chartData: [],
  profile: null,
});

export default {
  namespaced: true,

  state: () => initialState(),

  getters: {
    chartData: (state) => state.chartData,
    profile: state => state.profile,
  },

  mutations: {
    ADD_CHART_DATA(state, { data }) {
      state.chartData = data;
    },
    ADD_PROFILE(state, { profile }) {
      state.profile = profile;
    },
    REMOVE_CHART_DATA(state) {
      state.chartData = [];
    },
    REMOVE_PROFILE(state) {
      state.profile = null;
    },
    RESET_STATE(state) {
      Object.assign(state, initialState());
    },
  },

  actions: {
    addProfile({ commit }, { profile }) {
      const data = mapChartData(profile);
      commit('ADD_PROFILE', { profile });
      commit('ADD_CHART_DATA', { data });
    },
    async calculateResult({ dispatch }, { area, coordinates, layer, abstraction }) {
      dispatch('mapbox/setWmsLayersLoading', { isLoading: true }, { root: true });

      const layersGrouped = await getAbstractionData({ area, coordinates, layer, abstraction });
      dispatch('mapbox/setLayers', layersGrouped, { root: true });

      dispatch('mapbox/setWmsLayersLoading', { isLoading: false }, { root: true });
    },
    removeProfile({ commit }) {
      commit('REMOVE_PROFILE');
      commit('REMOVE_CHART_DATA');
    },
    reset({ commit }) {
      commit('RESET_STATE');
    },
    saveProject({ rootState, state }) {
      const { mapbox } = rootState;
      const { profile } = state;

      saveDataToJson({ mapbox, profile });
    },
  },
};
