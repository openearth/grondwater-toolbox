import Vue from 'vue';
let selectionIndex = 1;

const initialState = () => ({
  selections: [],
});

const selections = {
  namespaced: true,
  state: () => initialState(),
  getters: {
    loading(state) {
      return state.selections.some(selection => selection.loading);
    }
  },
  mutations: {
    add(state, selection) {
      state.selections.push({
        ...selection,
        name: `Selectie ${ selectionIndex }`
      });

      selectionIndex++;
    },
    remove(state, id) {
      state.selections = state.selections.filter(selection => selection.id !== id);
    },
    update(state, selection) {
      state.selections = state.selections.map(s => {
        if (s.id === selection.id) {
          return { ...selection, name: s.name };
        }

        return s;
      });
    },
    reset(state) {
      Object.assign(state, initialState());
    },
    setLoadingSelection(state, { id, value }) {
      const selection = state.selections.find(s => s.id === id);
      Vue.set(selection, 'loading', value);
    }
  },
};

export default selections;
