export default {
  namespaced: true,

  state: () => ({
    viewerConfig: '',
    viewerIntroduction: '',
    viewerName: '',
    viewerSteps: [],
    viewerStepsUnlocked: [ 1, 2, 3 ],
    viewerCurrentStep: null,
    viewerCurrentStepNumber: 1,
  }),

  getters: {
    viewerConfig: state => state.viewerConfig,
    viewerCurrentStep: state => state.viewerSteps[state.viewerCurrentStepNumber - 1],
    viewerCurrentStepNumber: state => state.viewerCurrentStepNumber,
    viewerIntroduction: state => state.viewerIntroduction,
    viewerSteps: state => state.viewerSteps,
    viewerStepsUnlocked: state => state.viewerStepsUnlocked,
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
    SET_VIEWER_CURRENT_NUMBER(state, { step }) {
      state.viewerCurrentStepNumber = step;
    },
  },

  actions: {
    setViewerConfig({ commit }, { config }) {
      commit('SET_VIEWER_CONFIG', { config });
    },
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
    setViewerCurrentStepNumber({ commit }, { step }) {
      commit('SET_VIEWER_CURRENT_NUMBER', { step });
    },
  },
};
