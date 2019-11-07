const selections = {
  namespaced: true,
  state: {
    selections: []
  },
  mutations: {
    add(state, selection) {
      state.selections.push(selection)
    },
    update(state, selection) {
      console.log(selection)
    }
  },
}

export default selections