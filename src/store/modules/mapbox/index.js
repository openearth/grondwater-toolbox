import wps from '@/lib/wps';
import layers from '@/lib/mapbox/layers';
import { generateWmsLayer } from '@/lib/project-layers';

const initialState = () => ({
  activePopup: null,
  activeMarker: null,
  features: [],
  hiddenWmsLayers: [],
  loadingWmsLayers: false,
  mapIsActive: false,
  wmsLayers: [],
});

export default {
  namespaced: true,

  state: initialState(),

  getters: {
    activePopup: state => state.activePopup,
    activeMarker: state => state.activeMarker,
    features: state => state.features,
    hiddenWmsLayers: state => state.hiddenWmsLayers,
    loadingWmsLayers: state => state.loadingWmsLayers,
    mapIsActive: state => state.mapIsActive,
    wmsLayers: state => state.wmsLayers,
  },

  mutations: {
    ADD_FEATURE(state, { feature }) {
      state.features.push(feature);
    },
    ADD_HIDDEN_WMS_LAYER(state, { layer }) {
      state.hiddenWmsLayers.push(layer);
    },
    ADD_WMS_LAYER(state, { layer }) {
      state.wmsLayers.push(layer);
    },
    REMOVE_FEATURE(state, { id }) {
      state.features = state.features.filter(feature => feature.id !== id);
    },
    REMOVE_HIDDEN_WMS_LAYER(state, { id }) {
      state.hiddenWmsLayers = state.hiddenWmsLayers.filter(layer => layer.id !== id);
    },
    RESET_HIDDEN_WMS_LAYERS(state) {
      state.hiddenWmsLayers = [];
    },
    RESET_WMS_LAYERS(state) {
      state.wmsLayers = [];
    },
    RESET_STATE(state) {
      Object.assign(state, initialState());
    },
    SET_WMS_LAYERS_LOADING(state, { isLoading }) {
      state.loadingWmsLayers = isLoading;
    },
    SET_ACTIVE_POPUP(state, { popup }) {
      state.activePopup = { ...popup };
    },
    SET_ACTIVE_MARKER(state, { marker }) {
      if (marker) {
        state.activeMarker = { ...marker };
      } else {
        state.activeMarker = null;
      }
    },
    SET_MAPBOX_DATA(state, { data }) {
      state = data;
    },
    SET_MAP_IS_ACTIVE(state, { isActive }) {
      state.mapIsActive = isActive;
    },
  },

  actions: {
    addFeature({ commit }, { feature }) {
      commit('ADD_FEATURE', { feature });
    },
    addHiddenWmsLayer({ commit }, { layer }) {
      commit('ADD_HIDDEN_WMS_LAYER', { layer });
    },
    addWmsLayer({ commit }, { layer }) {
      commit('ADD_WMS_LAYER', { layer });
    },
    async calculateResult({ dispatch }, data) {
      dispatch('setWmsLayersLoading', { isLoading: true });

      try {

        const layers = await wps(data);

        const wmsLayers = layers.map(({ url, layer, name }) => {
          return {
            ...generateWmsLayer({
              url,
              layer,
              id: layer,
            }),
            name: name,
            baseUrl: url,
          };
        });

        wmsLayers.forEach((layer, index) => {
          if (index !== 0) {
            dispatch('mapbox/addHiddenWmsLayer', { layer }, { root: true });
          }

          dispatch('mapbox/addWmsLayer', { layer }, { root: true });
        });
      } catch (err) {
        console.log(err);
      }

      dispatch('setWmsLayersLoading', { isLoading: false });
    },
    getFeature({ dispatch, rootState }, { feature }) {
      const { selections } = rootState;

      if (selections.selections.length) {
        dispatch('selections/setSelectionLoading', { id: feature.id, value: true }, { root: true });
      }

      wps({
        'functionId': 'brl_watercourses',
        'polygon': {
          'id': feature.id,
          'type': 'Feature',
          'properties': {},
          'geometry': feature.geometry,
        },
        'bufferDist': '100',
      })
      .then(({ watersCollection, watersIdentifier }) => {
        const newFeature = {
          ...layers.geojson.line({
            id: feature.id,
            data: watersCollection,
            paint: {
              'line-width': 5,
              'line-color': '#000',
              'line-opacity': 0.8,
            },
          }),
          watersIdentifier,
        };

        dispatch('addFeature', { feature: newFeature });

        if (selections.selections.length) {
          dispatch('selections/setSelectionLoading', { id: feature.id, value: false }, { root: true });
        }
      })
      .catch(err => {
        // @TODO :: Have proper error handling here!
        console.log('Error getting wps: ', err);
      });
    },
    removeFeature({ commit }, { id }) {
      commit('REMOVE_FEATURE', { id });
    },
    removeHiddenWmsLayer({ commit }, { id }) {
      commit('REMOVE_HIDDEN_WMS_LAYER', { id });
    },
    resetHiddenWmsLayers({ commit }) {
      commit('RESET_HIDDEN_WMS_LAYERS');
    },
    resetWmsLayers({ commit }) {
      commit('RESET_WMS_LAYERS');
    },
    reset({ commit }) {
      commit('RESET_STATE');
    },
    setActivePopup({ commit }, { popup }) {
      commit('SET_ACTIVE_POPUP', { popup });
    },
    setActiveMarker({ commit }, { marker }) {
      commit('SET_ACTIVE_MARKER', { marker });
    },
    setMapboxData({ commit }, { data }) {
      commit('SET_MAPBOX_DATA', { data });
    },
    setWmsLayersLoading({ commit }, { isLoading }) {
      commit('SET_WMS_LAYERS_LOADING', { isLoading });
    },
    setMapIsActive({ commit }, { isActive }) {
      commit('SET_MAP_IS_ACTIVE', { isActive });
    },
  },
};
