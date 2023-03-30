import Vue from 'vue';
import { v4 as uuid } from 'uuid';
import saveDataToJson from '@/lib/save-data-to-json';



const initialState = () => ({
  selections: [],
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
      const defaultForm = {
        id: uuid(),
        valid: true,
        data: {
          difference: '1',
          calculationLayer: 1,
          measure: 'riverbedDifference',
        },
      };
      state.selections.push({
        ...selection,
        configuration: selection.configuration || [defaultForm],
        name: selection.name || `Selectie #${totalSelections + 1}`,
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
      console.log('selection to add the form at: ', selection);
      const defaultForm = {
        id: uuid(),
        valid: true,
        data: {
          difference: '1',
          calculationLayer: 1,
          measure: 'riverbedDifference',
        },
      };
      selection.configuration.push(defaultForm);
    },
    REMOVE_SELECTION_CONFIGURATION(state, { selectionId, formId }) {
      const selection = state.selections.find((selection) => selection.id === selectionId);
      selection.configuration = selection.configuration.filter(({ id }) => id !== formId);
    },
  },

  actions: {
    addSelection({ commit }, { selection }) {
      commit('ADD_SELECTION', { selection });
    },
    addSelectionConfiguration({ commit }, { id }) {
      console.log('id', id);
      commit('ADD_SELECTION_CONFIGURATION', { id });
    },
    editSelectionName({ commit }, { id, name }) {
      commit('EDIT_SELECTION_NAME', { id, name });
    },
    removeSelection({ commit }, { id }) {
      commit('REMOVE_SELECTION', { id });
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
