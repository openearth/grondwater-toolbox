export default {
  namespaced: true,

  state: () => ({
    viewerConfig: '',
    viewerName: '',
    viewerIntroduction: '',
  }),

  getters: {
    viewerConfig: state => state.viewerConfig,
  },

  mutations: {
    SET_VIEWER_NAME(state, { name }) {
      state.viewerName = name;
    },
    SET_VIEWER_CONFIG(state, { config }) {
      state.viewerConfig = config;
    },
    SET_VIEWER_INTRODUCTION(state, { introduction }) {
      state.viewerIntroduction = introduction;
    },
  },

  actions: {
    setViewerName({ commit }, { name }) {
      document.title = name;
      commit('SET_VIEWER_NAME', { name });
    },
    setViewerIntroduction({ commit }, { introduction }) {
      commit('SET_VIEWER_INTRODUCTION', { introduction });
    },
  },
};
