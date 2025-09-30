import Vue from 'vue';
import Vuex from 'vuex';

import abstraction from './modules/abstraction';
import app from './modules/app';
import data from './modules/data';
import mapbox from './modules/mapbox';
import selections from './modules/selections';
import drainage from './modules/drainage';
import brl from './modules/brl';
import dig from './modules/dig';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    abstraction,
    app,
    data,
    selections,
    drainage,
    mapbox,
    brl,
    dig,
  },
});
