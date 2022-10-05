<template>
  <div class="pa-4 d-flex flex-column">
    <h2 class="text-h4">{{ stepTitle }}</h2>
    <v-divider class="mt-4 mb-4" />

    <step-components />

    <sidebar-footer>
      <v-btn
        slot="start"
        color="primary"
        depressed
        @click="onPrevious"
      >
        <v-icon>mdi-chevron-left</v-icon>
        Vorige
      </v-btn>
    </sidebar-footer>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex';
import bbox from '@turf/bbox';
import { featureCollection } from '@turf/helpers';

import SidebarFooter from '@/components/sidebar-footer';
import StepComponents from '@/components/step-components';

export default {
  components: {
    SidebarFooter,
    StepComponents,
  },
  computed: {
    ...mapGetters('app', ['viewerCurrentStep']),
    ...mapState({
      selections: (state) => state.selections.selections,
      features: (state) => state.mapbox.features,
      wmsLayers: (state) => state.mapbox.wmsLayers,
    }),
    stepTitle() {
      return this.viewerCurrentStep && this.viewerCurrentStep.title;
    },
  },
  created() {
    this.resetWmsLayers();
    if (!this.selections.length) {
      this.$router.push({ name: 'tool-step-1' });
    }

    if (this.$root.map) {
      const { __draw } = this.$root.map;

      __draw.changeMode('static');

      this.zoomToSelection();
    }
  },
  methods: {
    ...mapActions('app', ['setViewerCurrentStepIndex']),
    ...mapMutations('mapbox', ['resetWmsLayers']),
    onPrevious() {
      this.$router.push({ name: 'tool-step-1' });
      this.setViewerCurrentStepIndex({ step: 0 });
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
