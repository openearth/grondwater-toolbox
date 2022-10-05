export default {
  namespaced: true,

  state: () => ({
    viewerConfig: '',
    viewerIntroduction: '',
    viewerName: '',
    viewerSteps: [],
    viewerCurrentStep: null,
    viewerCurrentStepIndex: 0,
  }),

  getters: {
    viewerConfig: state => state.viewerConfig,
    viewerCurrentStep: state => state.viewerSteps[state.viewerCurrentStepIndex],
    viewerCurrentStepIndex: state => state.viewerCurrentStepIndex,
    viewerSteps: state => state.viewerSteps,
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
    SET_VIEWER_STEPS(state, { steps }) {
      state.viewerSteps = steps;
    },
    SET_VIEWER_CURRENT_INDEX(state, { step }) {
      state.viewerCurrentStepIndex = step;
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
    setViewerSteps({ commit }, { steps }) {
      commit('SET_VIEWER_STEPS', { steps });
    },
    setViewerCurrentStepIndex({ commit }, { step }) {
      commit('SET_VIEWER_CURRENT_INDEX', { step });
    },
  },
};
