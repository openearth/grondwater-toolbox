<template>
  <div class="py-6">
    <v-form :disabled="disabled" v-model="valid">

      <v-text-field
        v-model="form.riverbedDifference"
        type="number"
        min="-10"
        max="10"
        label="Verschil in rivierbodemhoogte (m)"
        :rules="[rules.required, rules.notZero, rules.minMaxDifference]"
        :disabled="disabled"
      ></v-text-field>

      <v-text-field
        v-model="form.extent"
        type="number"
        min="0"
        label="Grootte van het model (m)"
        :rules="[rules.required, rules.minExtent]"
        :disabled="disabled"
      ></v-text-field>

      <v-select
        v-model="form.calculationLayer"
        :items="calculationLayers.map(l => `Layer ${l}`)"
        label="Laag van berekening"
        :disabled="disabled"
      ></v-select>

      <v-select
        v-model="form.visualisationLayer"
        :items="visualisationLayers.map(l => `Layer ${l}`)"
        label="Laag van visualisatie"
        :disabled="disabled"
      ></v-select>

      <div class="d-flex justify-end mt-2">
        <v-btn
          @click="calculate"
          color="primary"
          :disabled="disabled || loadingWmsLayers || !valid"
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
        riverbedDifference: '1',
        extent: '1000',
        calculationLayer: 'Layer 1',
        visualisationLayer: 'Layer 1'
      },
      calculationLayers: [1, 2, 3, 4, 5, 6, 7],
      visualisationLayers: [1, 2, 3, 4, 5, 6, 7],
      rules: {
        required: value => !!value || 'Benodigd.',
        notZero: value => value !== '0' || 'Waarde mag niet 0 zijn.',
        minMaxDifference: value => (value >= -10 && value <= 10) || 'Waarde moet tussen -10 en 10 meter vallen.',
        minExtent: value => value >= 500 || 'Een grootte van minimaal 500 meter is vereist.'
      },
      valid: false
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
