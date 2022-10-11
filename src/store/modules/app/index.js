import cookie from '@/lib/cookie';

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

  state: {
    termsAndConditionsAccepted: false,
    ...initialState(),
  },

  getters: {
    termsAndConditionsAccepted: state => state.termsAndConditionsAccepted,
    viewerConfig: state => state.viewerConfig,
    viewerCurrentStep: state => state.viewerSteps[state.viewerCurrentStepNumber - 1],
    viewerCurrentStepNumber: state => state.viewerCurrentStepNumber,
    viewerIntroduction: state => state.viewerIntroduction,
    viewerMap: state => state.viewerMap,
    viewerSteps: state => state.viewerSteps,
    viewerStepsLocked: state => state.viewerStepsLocked,
  },

  mutations: {
    ADD_LOCKED_VIEWER_STEP(state, { step }) {
      if (!state.viewerStepsLocked.includes(step)) {
        state.viewerStepsLocked.push(step);
      }
    },
    REMOVE_LOCKED_VIEWER_STEP(state, { step }) {
      state.viewerStepsLocked = state.viewerStepsLocked.filter(item => item !== step);
    },
    RESET_STATE(state) {
      Object.assign(state, initialState());
    },
    SET_TERMS_AND_CONDITIONS_ACCEPTED(state, { accepted }) {
      state.termsAndConditionsAccepted = accepted;
    },
    SET_VIEWER_CONFIG(state, { config }) {
      state.viewerConfig = config;
    },
    SET_VIEWER_CURRENT_NUMBER(state, { step }) {
      state.viewerCurrentStepNumber = step;
    },
    SET_VIEWER_INTRODUCTION(state, { introduction }) {
      state.viewerIntroduction = introduction;
    },
    SET_VIEWER_NAME(state, { name }) {
      state.viewerName = name;
    },
    SET_VIEWER_STEPS(state, { steps }) {
      state.viewerSteps = steps;
    },
    SET_VIEWER_MAP(state, { map }) {
      state.viewerMap = map;
    },
  },

  actions: {
    addLockedViewerStep({ commit }, { step }) {
      commit('ADD_LOCKED_VIEWER_STEP', { step });
    },
    removeLockedViewerStep({ commit }, { step }) {
      commit('REMOVE_LOCKED_VIEWER_STEP', { step });
    },
    resetViewer({ commit }) {
      commit('RESET_STATE');
    },
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
    setViewerMap({ commit }, { map }) {
      commit('SET_VIEWER_MAP', { map });
    },
    setTermsAndConditionsAccepted({ commit }, { accepted }) {
      cookie('gtb_tac_accepted', accepted, 1);
      commit('SET_TERMS_AND_CONDITIONS_ACCEPTED', { accepted });
    },
  },
};
