<!-- TODO: this component can become configurable from the data/{tool}.json file -->
<template>
  <div class="selection-configuration">
    <v-form v-model="formValid">
      <v-row no-gutters>
        <v-col>
          <v-text-field
              v-model="extent"
              type="number"
              min="0"
              label="Grootte modelgebied (in m rondom de getekende polygoon)"
              :rules="[
              rules.requiredSizeModel,
              rules.minExtentSizeModel,
              rules.maxExtent
            ]"
              @update:error="setExtentValidity"
          />
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col>
          <v-text-field
              v-model="amount"
              type="number"
              min="0"
              label="Geef wijziging van drainage niveau aan (m)"
              :rules="[rules.requiredAmount, rules.minExtentAmount]"
              @update:error="setAmountValidity"
          />
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col>
          <v-select
              label="Horizontale rekenresolutie (meter)"
              v-model="selectedOutres"
              :items="outres.map(res => ({ text: `${res}m`, value: res }))"
              :rules="[rules.required]"
          />
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col>
          <v-select
              label="Drainage toepassen in laag"
              v-model="selectedLayer"
              :items="
                layers.map(layer => ({ text: `Laag ${layer}`, value: layer }))
              "
              :rules="[rules.required]"
          />
        </v-col>
      </v-row>
    </v-form>
    <div class="d-flex justify-space-between align-center">
      <v-alert
          v-if="loadingWmsLayers"
          class="mb-0 py-1"
          type="info"
          dense
          outlined
      >
        Let op! Dit kan even duren.
      </v-alert>
      <v-btn
          class="ml-auto"
          color="primary"
          :disabled="!valid || loadingWmsLayers"
          :loading="loadingWmsLayers"
          depressed
          @click="calculate"
      >
        Berekenen
      </v-btn>
    </div>

    <v-alert
        v-if="wmsLayers.length"
        class="mt-5"
        dense
        outlined
        type="info">
      Klik op een punt op de kaart om de waarde te zien.
    </v-alert>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';
  import bbox from '@turf/bbox';
  import { featureCollection } from '@turf/helpers';
  import createFeatureCollection from '@/lib/create-feature-collection';

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
        extentValid: true,
        amount: '10',
        amountValid: true,
        layers: [ 1, 2, 3, 4, 5, 6, 7 ],
        outres: [ 25, 50, 125, 250 ],
        selectedOutres: 250,
        selectedLayer: null,
        selectedColor: '#f79502',
        originalLineColor: '#000',
        formValid: false,
        rules: {
          required: (value) => !!value || 'Benodigd.',
          requiredSizeModel: value => !!value || 'Benodigd.',
          minExtentSizeModel: value =>
            value >= 500 || 'Een grootte van minimaal 500 meter is vereist.',
          requiredAmount: value => !!value || 'Benodigd.',
          minExtentAmount: value =>
            value >= 0 || 'Een grootte van minimaal 0 meter is vereist.',
          maxExtent: value =>
            parseFloat(value) <= 25000 ||
            'De grootte mag niet groter zijn dan 25.000 meter.',
        },
      };
    },
    created() {
      this.resetWmsLayers();

      // TODO: wmsLayers is empty when the user navigates back to the selection page.
      if (this.wmsLayers.length) {
        this.removeLockedViewerStep({ step: 3 });
      } else {
        this.addLockedViewerStep({ step: 3 });
      }

      if (!this.selections.length) {
        this.$router.push({ name: 'tool-introduction' });
      }

      if (this.$root.map) {
        const { __draw } = this.$root.map;

        if (__draw) {
          __draw.changeMode('static');
        }

        this.zoomToSelection();
      }
    },
    computed: {
      ...mapGetters('mapbox', [ 'features', 'loadingWmsLayers', 'wmsLayers' ]),
      ...mapGetters('selections', [ 'selections' ]),
      // iterates through all forms and checks if every one of them is valid
      valid() {
        return (
          this.selections.every(selection => {
            return selection.configuration.every(form => form.valid);
          }) && this.extentValid
        );
      },
    },
    methods: {
      ...mapActions('app', [
        'addLockedViewerStep',
        'removeLockedViewerStep',
        'setViewerCurrentStepNumber',
      ]),
      ...mapActions('mapbox', [
        'resetHiddenWmsLayers',
        'resetWmsLayers',
      ]),
      ...mapActions('drainage', [ 'calculateResult' ]),
      ...mapActions('selections', [
        'addSelectionConfiguration',
        'removeSelectionConfiguration',
      ]),
      async onNext() {
        this.$router.push({ name: 'tool-step-3' });
        this.setViewerCurrentStepNumber({ step: 3 });
      },
      addForm(id) {
        this.addSelectionConfiguration({ id });
      },
      async calculate() {
        this.resetWmsLayers();
        this.resetHiddenWmsLayers();

        let selection = this.selections[0]; //TODO: for now only for one selection. Future improvement
        selection.properties = {
          area: parseFloat(this.extent),
          depth: parseFloat(this.amount),
          outres: parseInt(this.selectedOutres, 10),
          layer: parseInt(this.selectedLayer, 10),
        };

        const data = {
          functionId: 'brl_wps_digit', //@TODO: Update to the correct functionId
          featureCollection: createFeatureCollection(selection),
        };

        await this.calculateResult(data);
        if (this.valid) {
          this.removeLockedViewerStep({ step: 3 });
        } else {
          this.addLockedViewerStep({ step: 3 });
        }
        setTimeout(() => {
          this.onNext();
        }, 0);
      },
      handleMouseLeave(id) {
        this.$root.map.setPaintProperty(id, 'line-color', this.originalLineColor);
      },
      handleMouseEnter(id) {
        this.$root.map.setPaintProperty(id, 'line-color', this.selectedColor);
      },
      handleInput({ id, formId, data }) {
        const feature = this.forms.find({ id } === id);
        const form = feature && feature.forms.find(({ id }) => id === formId);

        form.data = data;
      },
      handleDeleteForm(selectionId, formId) {
        this.removeSelectionConfiguration({ selectionId, formId });
      },
      setFormValidity(selection, { id, valid }) {
        const form = selection.configuration.find(form => form.id === id);

        form.valid = valid;
      },
      setExtentValidity(hasError) {
        this.extentValid = !hasError;
      },
      setAmountValidity(hasError) {
        this.amountValid = !hasError;
      },
      zoomToSelection() {
        if (!this.features.length) {
          return;
        }
        const bounds = bbox(
          featureCollection(
            this.features.map(feature => ({
              geometry: feature.source.data,
              type: 'Feature',
            }))
          )
        );

        this.$root.map.fitBounds(bounds, { padding: 50 });
      },
    },
  };
</script>

<style>
.selection-configuration {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
</style>
