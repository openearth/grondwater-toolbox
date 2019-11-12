<template>
  <div class="pa-4 fill-height d-flex flex-column">
    <h2>Configuratie</h2>

    <v-btn @click="calculate" color="accent">Bereken</v-btn>

    <sidebar-footer>
      <v-btn slot="start" class="primary" :to="{ name: 'selection' }">Vorige</v-btn>
    </sidebar-footer>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import SidebarFooter from '@/components/sidebar-footer';
import bbox from '@turf/bbox';
import { featureCollection } from '@turf/helpers';

export default {
  components: {
    SidebarFooter
  },
  computed: {
    ...mapState({
      selections: state => state.selections.selections,
      features: state => state.mapbox.features,
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

      this.$root.map.fitBounds(bounds, { padding: 50 });
    }
  }
};
</script>

<style>
</style>