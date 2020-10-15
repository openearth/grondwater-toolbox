<template>
  <div class="pa-4 d-flex flex-column">
    <h2>Configuratie</h2>

    <configuration-form />

    <p v-if="wmsLayers.length"><v-icon>mdi-information-outline</v-icon> Click on a point on the map to get the exact value</p>

    <sidebar-footer>
      <v-btn slot="start" class="primary" :to="{ name: 'selection' }">Vorige</v-btn>
    </sidebar-footer>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import SidebarFooter from '@/components/sidebar-footer';
import ConfigurationForm from '@/components/configuration-form';
import bbox from '@turf/bbox';
import { featureCollection } from '@turf/helpers';

export default {
  components: {
    SidebarFooter,
    ConfigurationForm
  },
  computed: {
    ...mapState({
      selections: state => state.selections.selections,
      features: state => state.mapbox.features,
      wmsLayers: state => state.mapbox.wmsLayers
    })
  },
  created() {
    if (!this.selections.length) {
      this.$router.push({ name: 'selection' });
    }

    if (this.$root.map) {
      const { __draw } = this.$root.map;

      __draw.changeMode('static');

      this.zoomToSelection();
    }
  },
  methods: {
    ...mapActions('mapbox', ['calculateResult']),
    calculate() {
      this.calculateResult();
    },
    zoomToSelection() {
      if(!this.features.length) {
        return;
      }

      const bounds = bbox(
        featureCollection(
          this.features.map(feature => ({
            geometry: feature.source.data,
            type: 'Feature'
          }))
        )
      );

      this.$root.map.fitBounds(bounds, { padding: 150 });
    }
  }
};
</script>
