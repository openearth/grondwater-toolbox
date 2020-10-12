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
      v-for="(feature, index) in features"
      :key="index"
      @mouseenter="handleMouseEnter(feature.id)"
      @mouseleave="handleMouseLeave(feature.id)"
    >
      <v-form  @input="setFormValidity(index, $event)">
        <v-card-title>Selectie {{ index + 1 }}</v-card-title>

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
      selectedColor: "#f79502",
      originalLineColor: null
    };
  },
  computed: {
    ...mapState({
      features: (state) => state.mapbox.features,
      loadingWmsLayers: (state) => state.mapbox.loadingWmsLayers,
    }),
    valid() {
      return this.formsValid.every(valid => valid) && this.extentValid;
    }
  },
  beforeMount() {
    this.$set(this, 'forms', this.features.map(({ id }) => ({
      id,
      riverbedDifference: '1',
      calculationLayer: 'Layer 1',
      visualisationLayer: 'Layer 1',
    })));

    this.$set(this, 'formsValid', this.features.map(() => true));
  },
  methods: {
    ...mapMutations('mapbox', ['resetWmsLayers']),
    ...mapActions('mapbox', ['calculateResult']),
    calculate() {
      const formattedForms = this.forms.map(form => ({
        ...form,
        extent: this.extent
      }));
      this.resetWmsLayers();
      this.calculateResult(formattedForms);
    },
    setFormValidity(index, value) {
      this.$set(this.formsValid, index, value);
    },
    setExtentValidity(hasError) {
      this.extentValid = !hasError;
    },
    handleMouseLeave(id) {
      const { map } = this.$root;
      map.setPaintProperty(id, 'line-color', this.originalLineColor);
      this.originalLineColor = null;
    },
    handleMouseEnter(id) {
      const { map } = this.$root;
      this.originalLineColor = map.getPaintProperty(id, 'line-color');
      map.setPaintProperty(id, 'line-color', this.selectedColor);
    }
  },
};
</script>

<style>
</style>
