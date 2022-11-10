import configRepo from '@/repo/configRepo.js';
import exportLayersData from '@/lib/export-layers-data';
import geoServerUrl from '@/lib/geoserver-url';

export default {
  namespaced: true,

  actions: {
    async getAppData({ dispatch }, route) {
      const viewer = route && route.params.config;
      const { name, introduction, steps, map } = await configRepo.getConfig(viewer);

      dispatch('app/setViewerName', { name }, { root: true });
      dispatch('app/setViewerIntroduction', { introduction }, { root: true });
      dispatch('app/setViewerSteps', { steps }, { root: true });
      dispatch('app/setViewerMap', { map }, { root: true });
    },
    loadProject({ dispatch }, data) {
      data.selections.selections.forEach((selection) => {
        dispatch('selections/addSelection', { selection }, { root: true });
      });

      dispatch('mapbox/setMapboxData', { data: data.mapbox }, { root: true });
    },
    async exportLayerData({ rootState }) {
      const { mapbox } = rootState;
      const urls = mapbox.wmsLayers.map(layer => geoServerUrl({
        url: process.env.VUE_APP_GEO_SERVER + '/geoserver/ows',
        service: 'WCS',
        version: '2.0.1',
        request: 'GetCoverage',
        coverageId: layer.id,
        encode: false,
        format: 'image/tiff',
      }));

      exportLayersData(urls);
    },
  },
};
