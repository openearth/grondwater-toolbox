<template>
  <div class="selection-configuration py-6">
    <v-text-field
      v-model="extent"
      type="number"
      min="0"
      label="Grootte van het model (m)"
      :rules="[rules.required, rules.minExtent]"
      @update:error="setExtentValidity"
    ></v-text-field>

    <configuration-card
      class="border-bottom"
      v-for="formGroup in formGroups"
      :key="formGroup.id"
      :id="formGroup.id"
      :title="formGroup.name"
      @mouseenter="handleMouseEnter(formGroup.id)"
      @mouseleave="handleMouseLeave(formGroup.id)"
    >
      <div class="selection-configuration__table">
        <v-row no-gutters>
          <v-col cols="12" sm="6">
            <v-card class="pa-2" outlined tile>Maatregel</v-card>
          </v-col>
          <v-col cols="12" sm="2">
            <v-card class="pa-2" outlined tile>Verschil</v-card>
          </v-col>
          <v-col cols="12" sm="3">
            <v-card class="pa-2" outlined tile>Berekening</v-card>
          </v-col>
        </v-row>

        <configuration-form
          v-for="(form, index) in formGroup.forms"
          v-model="form.data"
          :key="form.id"
          :id="form.id"
          :disabled="disabled"
          :deletable="index !== 0"
          @delete="handleDeleteForm(formGroup.id, $event)"
          @validated="setFormValidity(formGroup.id, $event)"
        />
      </div>

      <v-btn
        icon-start
        class="mt-4"
        title="berekening toevoegen"
        @click="addForm(formGroup.id)"
      >
        <v-icon left>mdi-plus</v-icon> Berekening
      </v-btn>
    </configuration-card>

    <div class="d-flex justify-end mt-5">
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
      // formGroups contains all forms that belong to a selection
      formGroups: [],
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
      selections: (state) => state.selections.selections,
      loadingWmsLayers: (state) => state.mapbox.loadingWmsLayers,
    }),
    // iterates through all forms and checks if every one of them is valid
    valid() {
      return (
        this.formGroups.every((formGroup) => {
          return formGroup.forms.every((form) => form.valid);
        }) && this.extentValid
      );
    },
    // prepares form data to be sent to the 'calculate' action
    formattedForms() {
      return this.formGroups.reduce((acc, feature) => {
        const { forms, watersIdentifier } = feature;

        forms.forEach((form) => {
          const { data } = form;

          const formattedData = {
            ...data,
            [data.measure]: data.difference,
          };

          delete formattedData.measure;
          delete formattedData.difference;

          acc.push({
            id: watersIdentifier,
            extent: this.extent,
            ...formattedData,
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
      this.features.map(({ id, watersIdentifier }, index) => ({
        id,
        name: this.selections[index].name,
        watersIdentifier,
        forms: [this.createForm()],
      }))
    );
  },
  methods: {
    ...mapMutations('mapbox', ['resetWmsLayers']),
    ...mapActions('mapbox', ['calculateResult']),
    async calculate() {
      this.resetWmsLayers();
      await this.calculateResult(this.formattedForms);
      this.$router.push({ name: 'results' });
    },
    setFormValidity(formGroupId, { id, valid }) {
      const formGroup = this.formGroups.find(({ id }) => id === formGroupId);
      const form = formGroup.forms.find((f) => f.id === id);

      form.valid = valid;
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
      // returns an object with a generated id and the validity + formData
      return {
        id: uuid(),
        valid: true,
        data: {
          difference: '1',
          calculationLayer: 1,
          measure: 'riverbedDifference',
        },
      };
    },
    addForm(id) {
      const { forms } = this.formGroups.find(
        (formGroup) => id === formGroup.id
      );

      forms.push(this.createForm());
    },
    handleDeleteForm(formGroupId, id) {
      const formGroup = this.formGroups.find(({ id }) => id === formGroupId);

      formGroup.forms = formGroup.forms.filter((form) => form.id !== id);
    },
  },
};
</script>

<style>
.border-bottom {
  border-color: rgba(0, 0, 0, 0.42);
  border-bottom-width: 1px;
  border-bottom-style: solid;
}
</style>
