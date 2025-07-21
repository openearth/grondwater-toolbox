import Vue from 'vue';
import { v4 as uuid } from 'uuid';
import saveDataToJson from '@/lib/save-data-to-json';


const initialState = () => ({
  selections: [],
});

const defaultConfiguration = JSON.stringify({
  enabled: false,
  difference: '0',
  calculationLayer: 1,
  measure: 'stageDiff',
});

export default {
  namespaced: true,

  state: () => initialState(),

  getters: {
    loading: state => state.selections.some(selection => selection.loading),
    selections: state => state.selections,
  },

  mutations: {
    ADD_SELECTION(state, { selection }) {
      const totalSelections = state.selections.length;
      state.selections.push({
        ...selection,
        name: selection.name || `Selectie #${ totalSelections + 1 }`,
        configuration: selection.configuration || [ {
          id: uuid(),
          valid: true,
          data: {
            main: { ...JSON.parse(defaultConfiguration), enabled: true },
            primary: JSON.parse(defaultConfiguration),
            secondary: JSON.parse(defaultConfiguration),
            tertiary: JSON.parse(defaultConfiguration),
          },
          } ],
      });
    },
    REMOVE_SELECTION(state, { id }) {
      state.selections = state.selections.filter(selection => selection.id !== id);
    },
    EDIT_SELECTION_NAME(state, { id, name }) {
      const selection = state.selections.find((selection) => selection.id === id);
      selection.name = name;
    },
    UPDATE_SELECTION(state, { selection }) {
      state.selections = state.selections.map(s => {
        if (s.id === selection.id) {
          return { ...s, ...selection, name: s.name };
        }

        return s;
      });
    },
    RESET_STATE(state) {
      Object.assign(state, initialState());
    },
    SET_SELECTION_LOADING(state, { id, value }) {
      const selection = state.selections.find(s => s.id === id);
      Vue.set(selection, 'loading', value);
    },
    ADD_SELECTION_CONFIGURATION(state, { id }) {
      const selection = state.selections.find((selection) => selection.id === id);
      const defaultForm = {
        id: uuid(),
        valid: true,
        data: JSON.parse(defaultConfiguration),
      };
      selection.configuration.push(defaultForm);
    },
    REMOVE_SELECTION_CONFIGURATION(state, { selectionId, formId }) {
      const selection = state.selections.find((selection) => selection.id === selectionId);
      selection.configuration = selection.configuration.filter(({ id }) => id !== formId);
    },
  },

  actions: {
    addSelection({ commit }, { selection, type = 'default' }) {
      commit('ADD_SELECTION', { selection, type });
    },
    addSelectionConfiguration({ commit }, { id }) {
      commit('ADD_SELECTION_CONFIGURATION', { id });
    },
    editSelectionName({ rootState, commit }, { id, name }) {
      commit('EDIT_SELECTION_NAME', { id, name });
      if (rootState.app.viewerConfig === 'drainage') {
        commit('drainage/EDIT_DRAINAGE_CONFIGURATION_NAME', { id, name }, { root: true });
      }
    },
    removeSelection({ commit, rootState }, { id }) {
      commit('REMOVE_SELECTION', { id });
       if (rootState.app.viewerConfig === 'drainage') {
        commit('drainage/REMOVE_DRAINAGE_CONFIGURATION', { selection: id }, { root: true });
      }
    },
    removeSelectionConfiguration({ commit }, { selectionId, formId }) {
      commit('REMOVE_SELECTION_CONFIGURATION', { selectionId, formId });
    },
    reset({ commit }) {
      commit('RESET_STATE');
    },
    setSelectionLoading({ commit }, { id, value }) {
      commit('SET_SELECTION_LOADING', { id, value });
    },
    saveProject({ rootState, state }) {
      const { mapbox } = rootState;
      const { selections } = state;

      saveDataToJson({ mapbox, selections });
    },
    updateSelection({ commit }, { selection }) {
      commit('UPDATE_SELECTION', { selection });
    },
  },
};
