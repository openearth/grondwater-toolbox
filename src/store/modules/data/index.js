import FileSaver from 'file-saver';

import configRepo from '@/repo/configRepo.js';

export default {
  namespaced: true,

  actions: {
    async getAppData({ dispatch }, route) {
      const viewer = route && route.params.config;
      const { name, introduction, steps } = await configRepo.getConfig(viewer);

      dispatch('app/setViewerName', { name }, { root: true });
      dispatch('app/setViewerIntroduction', { introduction }, { root: true });
      dispatch('app/setViewerSteps', { steps }, { root: true });
    },
    loadProject({ dispatch }, data) {
      data.selections.selections.forEach((selection) => {
        dispatch('selections/addSelection', { selection });
      });

      dispatch('mapbox/setMapboxData', { data: data.mapbox });
    },
    reset({ dispatch }) {
      dispatch('mapbox/resetMapbox');
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
  },
};
