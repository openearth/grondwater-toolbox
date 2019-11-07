import Vue from 'vue'
import Vuex from 'vuex'
import selections from './selections'
import mapbox from './mapbox'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    selections,
    mapbox
  }
})
