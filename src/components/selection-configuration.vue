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

    <configuration-card
      class="mb-6"
      v-for="(form, index) in forms"
      :key="form.id"
      :id="form.id"
      :title="`Selection ${index}`"
      :disabled="disabled"
      @mouseenter="handleMouseEnter(feature.id)"
      @mouseleave="handleMouseLeave(feature.id)"
      @input="handleInput"
    >
      <configuration-form
        v-for="formForm in form.forms"
        :key="formForm.id"
        :id="formForm.id"
        :disabled="disabled"
        v-model="formForm.data"
      />
    </configuration-card>

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
import { v4 as uuid } from 'uuid';
import { mapActions, mapMutations, mapState } from 'vuex';
import ConfigurationCard from '@/components/configuration-card';
import ConfigurationForm from '@/components/configuration-form';

export default {
  components: {
    ConfigurationCard,
    ConfigurationForm
  },
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
      selectedColor: '#f79502',
      originalLineColor: '#000',
      rules: {
        required: (value) => !!value || 'Benodigd.',
        minExtent: (value) =>
          value >= 500 || 'Een grootte van minimaal 500 meter is vereist.',
      },
    };
  },
  computed: {
    ...mapState({
      features: (state) => state.mapbox.features,
      loadingWmsLayers: (state) => state.mapbox.loadingWmsLayers,
    }),
    valid() {
      return this.formsValid.every((valid) => valid) && this.extentValid;
    },
    formattedForms() {
      return this.forms.reduce((acc, feature) => {
        const { forms, id } = feature;

        forms.forEach((form) => {
          acc.push({
            id,
            extent: this.extent,
            ...form,
          });
        });

        return acc;
      }, []);
    },
  },
  beforeMount() {
    this.$set(this, 'forms', this.features.map((feature) => ({
      id: feature.watersIdentifier,
      forms: [
        {
          id: uuid(),
          data: {
            riverbedDifference: '1',
            calculationLayer: 'Layer 1',
            visualisationLayer: 'Layer 1',
          }
        },
      ],
    })));

    this.$set(
      this,
      'formsValid',
      this.features.map(() => true)
    );
  },
  methods: {
    ...mapMutations('mapbox', ['resetWmsLayers']),
    ...mapActions('mapbox', ['calculateResult']),
    calculate() {
      this.resetWmsLayers();
      this.calculateResult(this.formattedForms);
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
    },
    handleMouseEnter(id) {
      const { map } = this.$root;
      map.setPaintProperty(id, 'line-color', this.selectedColor);
    },
    handleInput({ id, formId, data }) {
      const feature = this.forms.find(({ id }) === id);
      const form = feature && feature.forms.find(({ id }) => id === formId);    

      form.data = data;
    },
  },
};
</script>

<style>
</style>
