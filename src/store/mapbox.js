import wps from '../lib/wps';
import layers from '../lib/mapbox/layers';
import { generateWmsLayer } from '../lib/project-layers';

const initialState = () => ({
  features: [],
  wmsLayers: [],
  loadingWmsLayers: false
});

const features = {
  namespaced: true,
  state: initialState(),
  mutations: {
    addFeature(state, feature) {
      state.features.push(feature);
    },
    removeFeature(state, id) {
      state.features =   state.features.filter(feature => feature.id !== id);
    },
    updateFeature(state, feature) {
      state.features = state.features.map(f => {
        return f.id === feature.id ? feature : f;
      });
    },
    addWmsLayer(state, wmsLayer) {
      state.wmsLayers.push(wmsLayer);
    },
    resetWmsLayers(state) {
      state.wmsLayers = [];
    },
    setLoadingWmsLayers(state, value) {
      state.loadingWmsLayers = value;
    },
    reset(state) {
      Object.assign(state, initialState());
    }
  },
  actions: {
    async getFeature({ commit }, feature) {
      const { roadsCollection, roadsIdentifier } = await wps({
        "functionId": "ri2de_calc_roads",
        "polygon": {
          "id": feature.id,
          "type": "Feature",
          "properties": {},
          "geometry": feature.geometry
        },
        "bufferDist": "100"
      });

      commit('addFeature', {
        ...layers.geojson.line({
          id: feature.id,
          data: roadsCollection,
          paint: {
            'line-width': 5,
            'line-color': '#000',
            'line-opacity': 0.8
          }
        }),
        roadsIdentifier
      });
    },
    async updateFeature({ commit }, feature) {
      const { roadsCollection, roadsIdentifier } = await wps({
        "functionId": "ri2de_calc_roads",
        "polygon": {
          "id": feature.id,
          "type": "Feature",
          "properties": {},
          "geometry": feature.geometry
        },
        "bufferDist": "100"
      });

      commit('updateFeature', {
        ...layers.geojson.line({
          id: feature.id,
          data: roadsCollection,
          paint: {
            'line-width': 5,
            'line-color': '#000',
            'line-opacity': 0.8
          }
        }),
        roadsIdentifier
      });
    },
    async calculateResult({ commit, state }, requestData) {
      commit('setLoadingWmsLayers', true);

      try {
        const wmsLayers = await Promise.all(state.features.map(async (feature) => {
          // TODO: this is a call to the wrong function, replace this with the BRL function
          const data = {
            functionId: "brl_gwmodel",
            requestData,
            polygon: {
              "id": feature.id,
              "type": "Feature",
              "properties": {},
              "geometry": feature.source.data
            },
            roadsIdentifier: feature.roadsIdentifier
          };
  
          const { baseUrl, layerName, style } = await wps(data);
  
          const layerObject = {
            url: baseUrl,
            layer: layerName,
            id: layerName,
            style,
            roadsId: 'roads_1573136423177466'
          };
  
          return generateWmsLayer(layerObject);
        }));
  
        wmsLayers.forEach(wmsLayer => commit('addWmsLayer', wmsLayer));
      } catch (err) {
        commit('setError', 'Error fetching result', { root: true });
      }

      commit('setLoadingWmsLayers', false);
    }
  }
};

export default features;