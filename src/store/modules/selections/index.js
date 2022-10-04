import Vue from 'vue';
import { v4 as uuid } from 'uuid';
let selectionIndex = 1;

function createForm() {
  return {
    id: uuid(),
    valid: true,
    data: {
      difference: '1',
      calculationLayer: 1,
      measure: 'riverbedDifference',
    },
  };
}

const initialState = () => ({
  selections: [],
});

const selections = {
  namespaced: true,
  state: () => initialState(),
  getters: {
    loading(state) {
      return state.selections.some(selection => selection.loading);
    },
    configurations(state) {
      return state.selections.map(selection => selection.configuration);
    }
  },
  mutations: {
    add(state, selection) {
      state.selections.push({
        ...selection,
        name: selection.name || `Selectie ${selectionIndex}`,
        configuration: selection.configuration || [createForm()],
      });

      selectionIndex++;
    },
    remove(state, id) {
      state.selections = state.selections.filter(selection => selection.id !== id);
    },
    edit(state, { id, name }) {
      const selection = state.selections.find((selection) => selection.id === id);
      selection.name = name;
    },
    update(state, selection) {
      state.selections = state.selections.map(s => {
        if (s.id === selection.id) {
          return { ...s, ...selection, name: s.name };
        }

        return s;
      });
    },
    reset(state) {
      selectionIndex = 1;
      Object.assign(state, initialState());
    },
    setLoadingSelection(state, { id, value }) {
      const selection = state.selections.find(s => s.id === id);
      Vue.set(selection, 'loading', value);
    },
    addConfiguration(state, id) {
      const selection = state.selections.find((selection) => selection.id === id);
      selection.configuration.push(createForm());
    },
    deleteConfiguration(state, { selectionId, formId }) {
      const selection = state.selections.find((selection) => selection.id === selectionId);
      selection.configuration = selection.configuration.filter(({ id }) => id !== formId);
    }
  },
};

export default selections;
