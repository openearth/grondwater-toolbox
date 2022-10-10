const initialState = () => ({
  viewerConfig: '',
  viewerIntroduction: '',
  viewerMap: null,
  viewerName: '',
  viewerSteps: [],
  viewerStepsLocked: [ 2, 3 ], // only unlock the first step.
  viewerCurrentStep: null,
  viewerCurrentStepNumber: 1,
});

export default {
  namespaced: true,

  state: initialState(),

  getters: {
    viewerConfig: state => state.viewerConfig,
    viewerCurrentStep: state => state.viewerSteps[state.viewerCurrentStepNumber - 1],
    viewerCurrentStepNumber: state => state.viewerCurrentStepNumber,
    viewerIntroduction: state => state.viewerIntroduction,
    viewerMap: state => state.viewerMap,
    viewerSteps: state => state.viewerSteps,
    viewerStepsLocked: state => state.viewerStepsLocked,
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
    ADD_LOCKED_VIEWER_STEP(state, { step }) {
      if (!state.viewerStepsLocked.includes(step)) {
        state.viewerStepsLocked.push(step);
      }
    },
    REMOVE_LOCKED_VIEWER_STEP(state, { step }) {
      state.viewerStepsLocked = state.viewerStepsLocked.filter(item => item !== step);
    },
    SET_VIEWER_CURRENT_NUMBER(state, { step }) {
      state.viewerCurrentStepNumber = step;
    },
    SET_VIEWER_MAP(state, { map }) {
      state.viewerMap = map;
    },
    RESET_STATE(state) {
      Object.assign(state, initialState());
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
    addLockedViewerStep({ commit }, { step }) {
      commit('ADD_LOCKED_VIEWER_STEP', { step });
    },
    removeLockedViewerStep({ commit }, { step }) {
      commit('REMOVE_LOCKED_VIEWER_STEP', { step });
    },
    setViewerCurrentStepNumber({ commit }, { step }) {
      commit('SET_VIEWER_CURRENT_NUMBER', { step });
    },
    setViewerMap({ commit }, { map }) {
      commit('SET_VIEWER_MAP', { map });
    },
    resetViewer({ commit }) {
      commit('RESET_STATE');
    },
  },
};
