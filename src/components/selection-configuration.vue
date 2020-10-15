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
      v-for="(formGroup, index) in formGroups"
      :key="formGroup.id"
      :id="formGroup.id"
      :title="`Selection ${index}`"
      :disabled="disabled"
      @mouseenter="handleMouseEnter(formGroup.id)"
      @mouseleave="handleMouseLeave(formGroup.id)"
    >
      <configuration-form
        v-for="(form, index) in formGroup.forms"
        :key="form.id"
        :id="form.id"
        :disabled="disabled"
        :deletable="index !== 0"
        v-model="form.data"
        @delete="handleDeleteForm(formGroup.id, $event)"
      />

      <v-btn @click="addForm(formGroup.forms)" icon-start>
        <v-icon left>mdi-plus</v-icon> Berekening
      </v-btn>
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
    ConfigurationForm,
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
      formGroups: [],
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
      return this.formGroups.reduce((acc, feature) => {
        const { forms, id } = feature;

        forms.forEach((form) => {
          acc.push({
            id,
            extent: this.extent,
            ...form.data,
          });
        });

        return acc;
      }, []);
    },
  },
  beforeMount() {
    this.$set(
      this,
      'formGroups',
      this.features.map((feature) => ({
        id: feature.watersIdentifier,
        forms: [this.createForm()],
      }))
    );

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
      const feature = this.forms.find({ id } === id);
      const form = feature && feature.forms.find(({ id }) => id === formId);

      form.data = data;
    },
    createForm() {
      return {
        id: uuid(),
        data: {
          riverbedDifference: '1',
          calculationLayer: 'Layer 1',
          visualisationLayer: 'Layer 1',
        },
      };
    },
    addForm(forms) {
      forms.push(this.createForm());
    },
    handleDeleteForm(formGroupId, id) {
      const formGroup = this.formGroups.find(
        ({ id }) => id === formGroupId
      );

      formGroup.forms = formGroup.forms.filter(form => form.id !== id);
    },
  },
};
</script>
