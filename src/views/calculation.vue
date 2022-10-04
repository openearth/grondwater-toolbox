<template>
  <div class="pa-4 d-flex flex-column">
    <h2 class="text-h4">Configuratie</h2>
    <v-divider class="mt-4 mb-4" />

    <selection-configuration />

    <p v-if="wmsLayers.length" class="text-body-1">
      <v-icon>mdi-information-outline</v-icon>
      <span>Klik op een punt op de kaart om de waarde te zien</span>
    </p>

    <sidebar-footer>
      <v-btn
        slot="start"
        color="primary"
        :to="{ name: 'tool-selection' }"
        depressed
      >
        <v-icon>mdi-chevron-left</v-icon>
        Vorige
      </v-btn>
    </sidebar-footer>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
import SidebarFooter from '@/components/sidebar-footer';
import SelectionConfiguration from '@/components/selection-configuration';
import bbox from '@turf/bbox';
import { featureCollection } from '@turf/helpers';

export default {
  components: {
    SidebarFooter,
    SelectionConfiguration,
  },
  computed: {
    ...mapState({
      selections: (state) => state.selections.selections,
      features: (state) => state.mapbox.features,
      wmsLayers: (state) => state.mapbox.wmsLayers,
    }),
  },
  created() {
    this.resetWmsLayers();
    if (!this.selections.length) {
      this.$router.push({ name: 'tool-selection' });
    }

    if (this.$root.map) {
      const { __draw } = this.$root.map;

      __draw.changeMode('static');

      this.zoomToSelection();
    }
  },
  methods: {
    ...mapMutations('mapbox', ['resetWmsLayers']),
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
