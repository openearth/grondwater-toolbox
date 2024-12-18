<template>
  <div class="selection-configuration">
    <configuration-card
        v-for="(form) in drainageConfigurations"
        :key="form.id"
        :id="form.id"
        :title="form.name"
        @mouseenter="handleMouseEnter(form.id)"
        @mouseleave="handleMouseLeave(form.id)"
    >
      <drainage-configuration-form
          v-model="form.data"
          :id="form.id"
          :disabled="disabled"
          @validated="setFormValidity(form, $event)"
      />
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
  import ConfigurationCard from '@/components/configuration-card.vue';
  import DrainageConfigurationForm from '@/components/drainage-configuration-form.vue';

  export default {
    components: { DrainageConfigurationForm, ConfigurationCard },
    props: {
      disabled: {
        type: Boolean,
        required: false,
      },
    },
    data() {
      return {
        selectedLayer: null,
        selectedColor: '#f79502',
        originalLineColor: '#000',
      };
    },
    mounted() {
      this.selections.forEach(selection => {
        this.addDrainageConfiguration(selection);
      });
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
      ...mapGetters('drainage', [ 'drainageConfigurations' ]),
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
      ...mapActions('drainage', [ 'calculateResult', 'addDrainageConfiguration', 'updateDrainageConfiguration' ]),
      async onNext() {
        this.$router.push({ name: 'tool-step-3' });
        this.setViewerCurrentStepNumber({ step: 3 });
      },
      async calculate() {
        this.resetWmsLayers();
        this.resetHiddenWmsLayers();

        const selections = this.selections.map(selection => ({
          ...selection,
          properties: this.drainageConfigurations.find((config) => config.selection === selection.id).data,
        }));

        const data = {
          functionId: 'brl_wps_drainage',
          featureCollection: createFeatureCollection('drainage', selections),
        };
        console.log(data);

        await this.calculateResult(data);
        if (this.drainageConfigurations.each((config) => config.valid)) {
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
      setFormValidity(configuration, { id, valid }) {
        this.updateDrainageConfiguration({ id, valid });
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
