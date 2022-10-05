import FileSaver from 'file-saver';

import configRepo from '@/repo/configRepo.js';

let errorId = 0;

export default {
  namespaced: true,

  state: () => ({
    error: null,
  }),

  mutations: {
    SET_ERROR_MESSAGE(state, { message }) {
      state.error = {
        message: message,
        id: errorId,
      };

      errorId++;
    },
  },

  actions: {
    async getAppData({ dispatch }, route) {
      const viewer = route && route.params.config;
      const { name, introduction, steps } = await configRepo.getConfig(viewer);

      dispatch('app/setViewerName', { name }, { root: true });
      dispatch('app/setViewerIntroduction', { introduction }, { root: true });
      dispatch('app/setViewerSteps', { steps }, { root: true });
    },

    reset({ commit, dispatch }) {
      commit('mapbox/reset');
      dispatch('selections/resetSelections');
    },

    saveProject({ state }) {
      const project = {
        selections: state.selections,
        mapbox: state.mapbox,
      };
      const title = 'brl_project';
      const blob = new Blob([ JSON.stringify(project, null, 2) ], {
        type: 'application/json',
      });

      FileSaver.saveAs(blob, `${ title }.json`);
    },

    loadProject({ commit, dispatch }, data) {
      data.selections.selections.forEach((selection) => {
        dispatch('selections/addSelection', { selection });
      });

      commit('mapbox/set', data.mapbox);
    },
  },
};
