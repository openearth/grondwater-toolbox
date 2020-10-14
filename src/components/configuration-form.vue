<template>
  <v-form>
    <v-text-field
      v-model="riverbedDifference"
      type="number"
      min="-10"
      max="10"
      label="Verschil in rivierbodemhoogte (m)"
      :rules="[rules.required, rules.notZero, rules.minMaxDifference]"
      :disabled="disabled"
      @input="handleInput"
    />

    <v-select
      v-model="calculationLayer"
      :items="calculationLayers.map((l) => `Layer ${l}`)"
      label="Laag van berekening"
      :disabled="disabled"
      @input="handleInput"
    />

    <v-select
      v-model="visualisationLayer"
      :items="visualisationLayers.map((l) => `Layer ${l}`)"
      label="Laag van visualisatie"
      :disabled="disabled"
      @input="handleInput"
    />
  </v-form>
</template>

<script>
export default {
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      riverbedDifference: '1',
      calculationLayer: 'Layer 1',
      visualisationLayer: 'Layer 1',
      calculationLayers: [1, 2, 3, 4, 5, 6, 7],
      visualisationLayers: [1, 2, 3, 4, 5, 6, 7],
      rules: {
        required: (value) => !!value || 'Benodigd.',
        notZero: (value) => value !== '0' || 'Waarde mag niet 0 zijn.',
        minMaxDifference: (value) =>
          (value >= -10 && value <= 10) ||
          'Waarde moet tussen -10 en 10 meter vallen.',
      },
    };
  },
  computed: {
    data() {
      return  {
        riverbedDifference: this.riverbedDifference,
        calculationLayer: this.calculationLayer,
        visualisationLayer: this.visualisationLayer
      };
    }
  },
  created() {
    this.$emit('input', this.data);
  },
  methods: {
    handleInput() {
      this.$emit('input', this.data);
    }
  }
};
</script>
