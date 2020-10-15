<template>
  <v-form>
    <v-text-field
      v-model="formData.riverbedDifference"
      type="number"
      min="-10"
      max="10"
      label="Verschil in rivierbodemhoogte (m)"
      :rules="[rules.required, rules.notZero, rules.minMaxDifference]"
      :disabled="disabled"
    />

    <v-select
      v-model="formData.calculationLayer"
      :items="calculationLayers.map((l) => `Layer ${l}`)"
      label="Laag van berekening"
      :disabled="disabled"
    />

    <v-select
      v-model="formData.visualisationLayer"
      :items="visualisationLayers.map((l) => `Layer ${l}`)"
      label="Laag van visualisatie"
      :disabled="disabled"
    />

    <v-divider class="mb-4" />
  </v-form>
</template>

<script>
export default {
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    value: {
      type: Object,
      required: true
    },
  },
  data() {
    return {
      formData: {
        riverbedDifference: '1',
        calculationLayer: 'Layer 1',
        visualisationLayer: 'Layer 1',
      },
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
  watch: {
    formData() {
      this.$emit('input', this.formData);
    }
  },
  beforeMount() {
    this.formData = this.value;
  },
};
</script>
