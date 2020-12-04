import Vue from "vue";
import Vuex from "vuex";
import FileSaver from "file-saver";
import selections from "./selections";
import configuration from "./configuration";
import mapbox from "./mapbox";

Vue.use(Vuex);

let errorId = 0;

export default new Vuex.Store({
  state: {
    error: null,
  },
  mutations: {
    setError(state, message) {
      state.error = {
        message: message,
        id: errorId,
      };

      errorId++;
    },
  },
  actions: {
    reset({ commit }) {
      commit("mapbox/reset");
      commit("selections/reset");
    },
    saveProject({ state }) {
      const project = {
        selections: state.selections,
        mapbox: state.mapbox,
      };
      const title = "brl_project";
      const blob = new Blob([JSON.stringify(project, null, 2)], {
        type: "application/json",
      });

      FileSaver.saveAs(blob, `${title}.json`);
    },
    loadProject({ commit }, data) {
      data.selections.selections.forEach((selection) => {
        commit("selections/add", selection);
      });

      commit('mapbox/set', data.mapbox);
    },
  },
  modules: {
    selections,
    mapbox,
    configuration
  },
});
