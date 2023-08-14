import saveDataToJson from '@/lib/save-data-to-json';

export default {
  namespaced: true,
  actions: {
    saveProject({ rootState }) {
      
      const { mapbox, profile } = rootState;

      saveDataToJson({ mapbox, profile: profile.profile });
    },
  },
};
