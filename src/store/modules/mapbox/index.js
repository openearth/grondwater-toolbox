import wps from '@/lib/wps';
import layers from '@/lib/mapbox/layers';
import { generateWmsLayer } from '@/lib/project-layers';

const initialState = () => ({
  activePopup: null,
  activeMarker: null,
  features: [],
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
    loadingWmsLayers: state => state.loadingWmsLayers,
    mapIsActive: state => state.mapIsActive,
    wmsLayers: state => state.wmsLayers,
  },

  mutations: {
    ADD_FEATURE(state, { feature }) {
      state.features.push(feature);
    },
    ADD_WMS_LAYER(state, { layer }) {
      state.wmsLayers.push(layer);
    },
    REMOVE_FEATURE(state, { id }) {
      state.features = state.features.filter(feature => feature.id !== id);
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
      state.activePopup = popup;
    },
    SET_ACTIVE_MARKER(state, { marker }) {
      state.activeMarker = {...marker};
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
    addWmsLayer({ commit }, { layer }) {
      commit('ADD_WMS_LAYER', { layer });
    },
    async calculateResult({ dispatch }, requestData) {
      dispatch('setWmsLayersLoading', { isLoading: true });

      try {
        const data = {
          functionId: 'brl_gwmodel',
          requestData: requestData,
        };

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

        wmsLayers.forEach((layer) => dispatch('addWmsLayer', { layer }));
      } catch (err) {
        console.log(err);
      }

      dispatch('setWmsLayersLoading', { isLoading: false });
    },
    getFeature({ dispatch }, { feature }) {
      dispatch('selections/setSelectionLoading', { id: feature.id, value: true }, { root: true });

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
        dispatch('selections/setSelectionLoading', { id: feature.id, value: false }, { root: true });
      })
      .catch(err => {
        // @TODO :: Have proper error handling here!
        console.log('Error getting wps: ', err);
      });
    },
    removeFeature({ commit }, { id }) {
      commit('REMOVE_FEATURE', { id });
    },
    resetWmsLayers({ commit }) {
      commit('RESET_WMS_LAYERS');
    },
    resetMapbox({ commit }) {
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
