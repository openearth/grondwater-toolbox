<template>
  <div>
    <v-form class="d-flex" v-model="valid">
      <div :style="{ flex: 1 }">
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
          :items="calculationLayers.map((l) => ({ text: `Layer ${l}`, value: l}))"
          label="Laag van berekening"
          :disabled="disabled"
        />

        <v-select
          v-model="formData.visualisationLayer"
          :items="visualisationLayers.map((l) => ({ text: `Layer ${l}`, value: l}))"
          label="Laag van visualisatie"
          :disabled="disabled"
        />
      </div>
      <div
        v-if="deletable"
        class="pl-4 pt-4"
      >
        <v-btn icon @click="handleDelete"><v-icon>mdi-delete</v-icon></v-btn>
      </div>
    </v-form>
    <v-divider class="mb-4" />
  </div>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    value: {
      type: Object,
      required: true
    },
    deletable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formData: {
        riverbedDifference: '1',
        calculationLayer: 1,
        visualisationLayer: 1,
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
      valid: false
    };
  },
  watch: {
    formData() {
      this.$emit('input', this.formData);
    },
    valid() {
      this.$emit('validated', { id: this.id, valid: this.valid });
    }
  },
  beforeMount() {
    this.formData = this.value;
  },
  methods: {
    handleDelete() {
      this.$emit('delete', this.id);
    }
  }
};
</script>
