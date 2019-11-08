<template>
  <div class="px-4 pb-5">
    <v-form :disabled="disabled">
      <v-text-field
        v-model="form.riverbedDifference"
        type="number"
        label="Difference in riverbed (m)"
        required
        :disabled="disabled"
      ></v-text-field>
      <v-text-field
        v-model="form.extent"
        type="number"
        label="Extent (m)"
        required
        :disabled="disabled"
      ></v-text-field>

      <v-select
        v-model="form.calculationLayer"
        :items="calculationLayers.map(l => `Layer ${l}`)"
        label="Layer for calculation"
        required
        :disabled="disabled"
      ></v-select>
      <v-select
        v-model="form.visualisationLayer"
        :items="visualisationLayers.map(l => `Layer ${l}`)"
        label="Layer for visualisation"
        required
        :disabled="disabled"
      ></v-select>

      <v-btn @click="calculate" color="primary" :disabled="disabled">Calculate</v-btn>
    </v-form>
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex';

export default {
  props: {
    disabled: {
      type: Boolean,
      required: false
    }
  },
  data() {
    return {
      form: {
        riverbedDifference: 0,
        extent: 0,
        calculationLayer: null,
        visualisationLayer: null
      },
      calculationLayers: [1, 2, 3, 4, 5, 6, 7],
      visualisationLayers: [1, 2, 3, 4, 5, 6, 7]
    };
  },
  methods: {
    ...mapMutations('mapbox', ['resetWmsLayers']),
    ...mapActions('mapbox', ['calculateResult']),
    calculate() {
      this.resetWmsLayers();
      this.calculateResult();
    }
  }
};
</script>

<style>
</style>