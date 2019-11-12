let selectionIndex = 1;

const selections = {
  namespaced: true,
  state: {
    selections: [],
  },
  mutations: {
    add(state, selection) {
      state.selections.push({
        ...selection,
        name: `Selectie ${selectionIndex}`
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
    }
  },
};

export default selections;