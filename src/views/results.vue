<template>
  <div class="pa-4 d-flex flex-column">
    <h2 class="mb-4">Results</h2>

    <ul class="risks-list mb-6">
      <li class="risks-list__item" v-for="layer in wmsLayers" :key="layer.id">
        <v-btn class="mr-2" text icon>
          <v-icon @click="onLayerVisibilityClick(layer.id)">{{
            hiddenLayers.includes(layer.id) ? 'mdi-eye-off' : 'mdi-eye'
          }}</v-icon>
        </v-btn>
        <span class="risks-list__item-title">{{ layer.name }}</span>
      </li>
    </ul>

    <sidebar-footer>
      <v-btn slot="start" class="primary" :to="{ name: 'calculation' }"
        >Vorige</v-btn
      >
    </sidebar-footer>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import SidebarFooter from '../components/sidebar-footer';

export default {
  components: {
    SidebarFooter,
  },
  data() {
    return {
      hiddenLayers: [],
    };
  },
  computed: {
    ...mapState({
      selections: (state) => state.selections.selections,
      features: (state) => state.mapbox.features,
      wmsLayers: (state) => state.mapbox.wmsLayers,
    }),
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
    onLayerVisibilityClick(id) {
      let opacityToSet;

      if (this.hiddenLayers.includes(id)) {
        opacityToSet = 1;
        this.hiddenLayers = this.hiddenLayers.filter(
          (hiddenLayerId) => hiddenLayerId !== id
        );
      } else {
        opacityToSet = 0;
        this.hiddenLayers.push(id);
      }

      this.$root.map.setPaintProperty(id, 'raster-opacity', opacityToSet);
    },
  },
};
</script>

<style>
.risks-list {
  padding: 0 !important;
  list-style: none outside none;
  border-top: thin solid #eee;
}

.risks-list__item {
  padding: 0.5rem 0;
  border-bottom: thin solid #eee;
}

.risks-list__item-title {
  text-transform: capitalize;
}
</style>