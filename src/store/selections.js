let selectionIndex = 1

const selections = {
  namespaced: true,
  state: {
    selections: [],
  },
  mutations: {
    add(state, selection) {
      state.selections.push({
        ...selection,
        name: `Selection ${selectionIndex}`
      })

      selectionIndex++
    },
    update(state, selection) {
      state.selections = state.selections.map(s => {
        if (s.id === selection.id) {
          return selection
        }

        return s
      })
    }
  },
}

export default selections