import getSystemData from '@/lib/get-system-data';

export default {
    namespaced: true,

    actions: {
        async calculateResult({ dispatch }, data) {
            dispatch('mapbox/setWmsLayersLoading', { isLoading: true }, { root: true });
      
            const layersGrouped = await getSystemData(data);
           
            dispatch('mapbox/setLayers', layersGrouped, { root: true });
      
            dispatch('mapbox/setWmsLayersLoading', { isLoading: false }, { root: true });
          },
    },
};
