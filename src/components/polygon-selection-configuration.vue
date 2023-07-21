<!-- TODO: this component can become configurable from the data/{tool}.json file -->
<template>
  <div class="selection-configuration">
    <v-text-field
      v-model="extent"
      type="number"
      min="0"
      label="Grootte van het model (m)"
      :rules="[rules.requiredSizeModel, rules.minExtentSizeModel]"
      @update:error="setExtentValidity"
    />

    <v-text-field
      v-model="amount"
      type="number"
      min="0"
      label="Amount to dig away"
      :rules="[rules.requiredAmountToDig, rules.minExtentAmountToDig]"
      @update:error="setAmountValidity"
    />

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
      type="info"
    >
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
        selectedColor: '#f79502',
        originalLineColor: '#000',
        rules: {
          requiredSizeModel: (value) => !!value || 'Benodigd.',
          minExtentSizeModel: (value) =>
            value >= 500 || 'Een grootte van minimaal 500 meter is vereist.',
          requiredAmountToDig: (value) => !!value || 'Benodigd.',
          minExtentAmountToDig: (value) =>
            value >= 0 || 'Een grootte van minimaal 0 meter is vereist.',
          
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
          this.selections.every((selection) => {
            return selection.configuration.every((form) => form.valid);
          }) && this.extentValid
        );
      },
    

    },
    methods: {
      ...mapActions('app', [ 'addLockedViewerStep', 'removeLockedViewerStep', 'setViewerCurrentStepNumber' ]),
      ...mapActions('mapbox', [ 'calculateResult', 'resetHiddenWmsLayers', 'resetWmsLayers' ]),
      ...mapActions('selections', [ 'addSelectionConfiguration', 'removeSelectionConfiguration' ]),
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
          layer: '1',
          depth: parseFloat(this.amount), 
        };
        
        const data = {
          functionId: 'brl_wps_digit',
          featureCollection:createFeatureCollection(selection),
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
        const form = selection.configuration.find((form => form.id === id));

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
            this.features.map((feature) => ({
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
