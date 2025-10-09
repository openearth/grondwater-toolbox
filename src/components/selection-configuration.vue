<!-- TODO: this component can become configurable from the data/{tool}.json file -->
<template>
  <div class="selection-configuration">
    <v-text-field
        v-model="extent"
        type="number"
        min="0"
        label="Grootte modelgebied (in m rondom de getekende polygoon)"
        :rules="[rules.required, rules.minExtent, rules.maxExtent]"
        @update:error="setExtentValidity"
    />

    <configuration-card
        v-for="(selection, index) in selections"
        :key="selection.id"
        :id="selection.id"
        :title="selection.name"
        @mouseenter="handleMouseEnter(selection.id)"
        @mouseleave="handleMouseLeave(selection.id)"
    >
      <v-row no-gutters class="mt-6">
        <v-col cols="12" sm="1">
          <v-card
              class="pa-2 full-height"
              outlined
              tile
          >
          </v-card>
        </v-col>
        <v-col cols="12" sm="3">
          <v-card
              class="pa-2"
              outlined
              tile
          >
            Niveau
          </v-card>
        </v-col>
        <v-col cols="12" sm="4">
          <v-card
              class="pa-2"
              outlined
              tile
          >
            Maatregel
          </v-card>
        </v-col>
        <v-col cols="12" sm="2">
          <v-card
              class="pa-2"
              outlined
              tile
          >
            Verschil
          </v-card>
        </v-col>
        <v-col cols="12" sm="2">
          <v-card
              class="pa-2"
              outlined
              tile
          >
            Laag
          </v-card>
        </v-col>
      </v-row>


      <configuration-form
          v-for="(form, index) in selection.configuration"
          v-model="form.data"
          :key="form.id"
          :id="form.id"
          :disabled="disabled"
          :deletable="index !== 0"
          @delete="handleDeleteForm(selection.id, $event)"
          @validated="setFormValidity(selection, $event)"
      />

      <v-divider v-if="index !== selections.length - 1" class="mt-6" />
    </configuration-card>

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
        extentValid: true,
        selectedColor: '#f79502',
        originalLineColor: '#000',
        levels: {
          main: 'h',
          primary: 'p',
          secondary: 's',
          tertiary: 't',
        },
        defaultData: {
          'h_stageDiff': '0.0',
          'h_resisDiff': '0.0',
          'h_rbotDiff': '0.0',
          'p_stageDiff': '0.0',
          'p_resisDiff': '0.0',
          'p_rbotDiff': '0.0',
          's_stageDiff': '0.0',
          's_resisDiff': '0.0',
          's_rbotDiff': '0.0',
          't_stageDiff': '0.0',
          't_resisDiff': '0.0',
          't_rbotDiff': '0.0',
        },
        rules: {
          required: (value) => !!value || 'Benodigd.',
          minExtent: (value) =>
            value >= 500 || 'Een grootte van minimaal 500 meter is vereist.',
          maxExtent: (value) =>
            parseFloat(value) <= 25000 || 'De grootte mag niet groter zijn dan 25.000 meter.',
        },
        wpsId: 'brl_wps_watersystem', // This should be configurable based on the tool
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
        const { __draw, __markerControl } = this.$root.map;

        if (__draw) {
          __draw.changeMode('static');
        }
        
        if (__markerControl) {
          __markerControl.setStaticMode(true);
        }

        this.zoomToSelection();
      }
    },
    computed: {
      ...mapGetters('app', [ 'viewerConfig' ]),
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
      // prepares form data to be sent to the 'calculate' action
      formattedForms() {
        return this.selections.reduce((acc, selection) => {
          const { configuration } = selection;
          const feature = this.features.find(feature => feature.id === selection.id);
          configuration.forEach((form, index) => {
            acc.push({
              id: feature.watersIdentifier || index + 1,
              extent: this.extent,
              geometry: selection.geometry,
              ...this.defaultData,
              ...Object.fromEntries(
                // maps the form data to the correct format i.e. h_stageDiff: 0.0
                Object.entries(form.data).map(([ key, value ]) => [ `${ this.levels[key] }_${ value.measure }`, parseFloat(value.difference).toFixed(1) ])
              ),
              ...('measure' in form.data ? { [form.data.measure]: form.data.difference } : {}),
            });
          });

          return acc;
        }, []);
      },
    },
    methods: {
      ...mapActions('app', [ 'addLockedViewerStep', 'removeLockedViewerStep', 'setViewerCurrentStepNumber' ]),
      ...mapActions('mapbox', [ 'resetHiddenWmsLayers', 'resetWmsLayers' ]),
      ...mapActions('selections', [ 'addSelectionConfiguration', 'removeSelectionConfiguration' ]),
      ...mapActions('brl', [ 'calculateResult' ]),
      async onNext() {
        this.$router.push({ name: 'tool-step-3' });
        this.setViewerCurrentStepNumber({ step: 3 });
      },
      async calculate() {
        this.resetWmsLayers();
        this.resetHiddenWmsLayers();

        await this.calculateResult(this.formattedForms);

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
      zoomToSelection() {
        if (!this.selections.length || !this.features.length) {
          return;
        }
        this.$root.map.fitBounds(bbox(
          featureCollection(
            this.selections
          )
        ), { padding: 50 });
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
