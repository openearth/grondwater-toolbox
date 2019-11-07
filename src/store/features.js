import wps from '../lib/wps'
import layers from '../lib/mapbox/layers'

const features = {
  namespaced: true,
  state: {
    features: []
  },
  mutations: {
    add(state, feature) {
      state.features.push(feature)
    },
  },
  actions: {
    async get({ commit }, feature) {
      const { roadsCollection } = await wps({
        "functionId": "ri2de_calc_roads",
        "polygon": {
          "id": feature.id,
          "type": "Feature",
          "properties": {},
          "geometry": feature.geometry
        },
        "bufferDist": "100"
      })

      commit('add', layers.geojson.line({
        id: feature.id,
        data: roadsCollection,
        paint: {
          'line-width': 5,
          'line-color': '#000',
          'line-opacity': 0.8
        }
      }))
    }
  }
}

export default features