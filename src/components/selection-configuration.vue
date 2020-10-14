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
      v-for="(feature, index) in features"
      :key="index"
      :id="feature.watersIdentifier"
      :title="`Selection ${index}`"
      :disabled="disabled"
      @mouseenter="handleMouseEnter(feature.id)"
      @mouseleave="handleMouseLeave(feature.id)"
      @input="handleInput"
    />

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
import ConfigurationCard from '@/components/configuration-card';
import { mapActions, mapMutations, mapState } from 'vuex';

export default {
  components: {
    ConfigurationCard
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
      forms: {}, 
      formsValid: [],
      extentValid: true,
      selectedColor: "#f79502",
      originalLineColor: "#000",
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
      return this.formsValid.every(valid => valid) && this.extentValid;
    },
    formattedForms() {
      return Object
        .entries(this.forms)
        .reduce((acc, entry) => {
          const [key, forms] = entry;

          forms.forEach(form => {
            acc.push({
              id: key,
              extent: this.extent,
              ...form,
            });
          });

          return acc;
        }, []);
    }
  },
  beforeMount() {
    this.$set(this, 'formsValid', this.features.map(() => true));
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
    handleInput({ id, index, data }) {
      if (!this.forms[id]) {
        this.forms[id] = []; 
      } 

      this.forms[id][index] = data;
    }
  },
};
</script>

<style>
</style>
