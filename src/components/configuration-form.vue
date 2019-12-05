<template>
  <div class="py-6">
    <v-form :disabled="disabled">
      <v-text-field
        v-model="form.riverbedDifference"
        type="number"
        label="Verschil in rivierbodemhoogte (m)"
        required
        :disabled="disabled"
      ></v-text-field>
      <v-text-field
        v-model="form.extent"
        type="number"
        label="Grootte van het model (m)"
        required
        :disabled="disabled"
      ></v-text-field>

      <v-select
        v-model="form.calculationLayer"
        :items="calculationLayers.map(l => `Layer ${l}`)"
        label="Laag van berekening"
        required
        :disabled="disabled"
      ></v-select>
      <v-select
        v-model="form.visualisationLayer"
        :items="visualisationLayers.map(l => `Layer ${l}`)"
        label="Laag van visualisatie"
        required
        :disabled="disabled"
      ></v-select>
      <div class="d-flex justify-end mt-2">
        <v-btn
          @click="calculate"
          color="primary"
          :disabled="disabled || loadingWmsLayers"
          :loading="loadingWmsLayers"
        >
          Bereken
        </v-btn>
      </div>
    </v-form>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';

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
        calculationLayer: 'Layer 1',
        visualisationLayer: 'Layer 1'
      },
      calculationLayers: [1, 2, 3, 4, 5, 6, 7],
      visualisationLayers: [1, 2, 3, 4, 5, 6, 7]
    };
  },
  computed: {
    ...mapState({
      loadingWmsLayers: state => state.mapbox.loadingWmsLayers
    })
  },
  methods: {
    ...mapMutations('mapbox', ['resetWmsLayers']),
    ...mapActions('mapbox', ['calculateResult']),
    calculate() {
      this.resetWmsLayers();
      this.calculateResult(this.form);
    }
  }
};
</script>

<style>
</style>
