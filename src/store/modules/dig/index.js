import wps from '@/lib/wps';

export default {
    namespaced: true,

    actions: {
        async calculateResult({ dispatch }, data) {
            dispatch('mapbox/setWmsLayersLoading', { isLoading: true }, { root: true });
      
            const layersGrouped = await wps(data);
            dispatch('mapbox/setLayers', layersGrouped, { root: true });
      
            dispatch('mapbox/setWmsLayersLoading', { isLoading: false }, { root: true });
          },
    },
};
