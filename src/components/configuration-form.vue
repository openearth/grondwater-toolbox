<template>
  <div class="py-6">
    <v-text-field
      v-model="extent"
      type="number"
      min="0"
      label="Grootte van het model (m)"
      :rules="[rules.required, rules.minExtent]"
      @update:error="setExtentValidity"
    ></v-text-field>

    <v-card
      class="mb-6"
      v-for="(layer, index) in wmsLayers"
      :key="index"
    >
      <v-form  @input="setFormValidity(index, $event)">
        <v-card-title>{{ layer.name }}</v-card-title>

        <v-card-text>
          <v-text-field
            v-model="forms[index].riverbedDifference"
            type="number"
            min="-10"
            max="10"
            label="Verschil in rivierbodemhoogte (m)"
            :rules="[rules.required, rules.notZero, rules.minMaxDifference]"
            :disabled="disabled"
          ></v-text-field>

          <v-select
            v-model="forms[index].calculationLayer"
            :items="calculationLayers.map((l) => `Layer ${l}`)"
            label="Laag van berekening"
            :disabled="disabled"
          ></v-select>

          <v-select
            v-model="forms[index].visualisationLayer"
            :items="visualisationLayers.map((l) => `Layer ${l}`)"
            label="Laag van visualisatie"
            :disabled="disabled"
          ></v-select>
        </v-card-text>
      </v-form>
    </v-card>

     <div class="d-flex justify-end">
      <v-btn
        @click="calculate"
        color="primary"
        :disabled="!valid || loadingWmsLayers"
        :loading="loadingWmsLayers"
      >
        Bereken
      </v-btn>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';

export default {
  props: {
    disabled: {
      type: Boolean,
      required: false,
    },
  },
  data() {
    return {
      extent: '1000',
      forms: [],
      formsValid: [],
      extentValid: true,
      calculationLayers: [1, 2, 3, 4, 5, 6, 7],
      visualisationLayers: [1, 2, 3, 4, 5, 6, 7],
      rules: {
        required: (value) => !!value || 'Benodigd.',
        notZero: (value) => value !== '0' || 'Waarde mag niet 0 zijn.',
        minMaxDifference: (value) =>
          (value >= -10 && value <= 10) ||
          'Waarde moet tussen -10 en 10 meter vallen.',
        minExtent: (value) =>
          value >= 500 || 'Een grootte van minimaal 500 meter is vereist.',
      },
    };
  },
  computed: {
    ...mapState({
      wmsLayers: (state) => state.wmsLayers,
      loadingWmsLayers: (state) => state.mapbox.loadingWmsLayers,
    }),
    valid() {
      return this.formsValid.every(valid => valid) && this.extentValid;
    }
  },
  beforeMount() {
    this.$set(this, 'forms', this.wmsLayers.map(() => ({
      riverbedDifference: '1',
      calculationLayer: 'Layer 1',
      visualisationLayer: 'Layer 1',
    })));

    this.$set(this, 'formsValid', this.wmsLayers.map(() => true));
  },
  methods: {
    ...mapMutations('mapbox', ['resetWmsLayers']),
    ...mapActions('mapbox', ['calculateResult']),
    calculate() {
      this.resetWmsLayers();
      this.calculateResult(this.forms);
    },
    setFormValidity(index, value) {
      this.$set(this.formsValid, index, value);
    },
    setExtentValidity(hasError) {
      this.extentValid = !hasError;
    }
  },
};
</script>

<style>
</style>
