// import Vue from "vue";
import { v4 as uuid } from "uuid";

const initialState = () => ({
  configuration: [],
});

function createForm() {
  return {
    id: uuid(),
    valid: true,
    data: {
      difference: "1",
      calculationLayer: 1,
      measure: "riverbedDifference",
    },
  };
}

function generateConfuguration(features, selections) {
  return features.map(({ id, watersIdentifier }, index) => ({
    id,
    name: selections[index].name,
    watersIdentifier,
    forms: [createForm()],
  }));
}

const configuration = {
  namespaced: true,
  state: () => initialState(),
  mutations: {
    init(state, features) {
      if (state.configuration) {
        state.configuration = generateConfuguration(features);
      }
    },
    reset(state) {
      Object.assign(state, initialState());
    },
  },
};

export default configuration;
