<template>
  <div class="pa-4 d-flex flex-column">
    <h2 class="text-h4">Results</h2>

    <ul class="risks-list mb-6">
      <li
        class="risks-list__item"
        v-for="layer in wmsLayers"
        :key="layer.id"
      >
        <v-btn
          @click="onLayerVisibilityClick(layer.id)"
          class="mr-2"
          text
          icon
        >
          <v-icon>
            {{ hiddenLayers.includes(layer.id) ? 'mdi-eye-off' : 'mdi-eye' }}
          </v-icon>
        </v-btn>
        <span class="risks-list__item-title">{{ layer.name }}</span>
      </li>
    </ul>

    <sidebar-footer>
      <v-btn
        slot="start"
        color="primary"
        :to="{ name: 'tool-step-2' }"
        depressed
      >
        Vorige
      </v-btn>
    </sidebar-footer>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import SidebarFooter from '../components/sidebar-footer';

  export default {
    components: { SidebarFooter },
    data() {
      return {
        hiddenLayers: [],
      };
    },
    watch: {
      hiddenLayers() {
        const activeLayers = this.wmsLayers.filter((layer) =>
          !this.hiddenLayers.find(id => id === layer.id)
        ).map(({ id }) => id);

        this.hiddenLayers.forEach(id => {
          this.$root.map.setPaintProperty(id, 'raster-opacity', 0);
        });

        activeLayers.forEach(id => {
          this.$root.map.setPaintProperty(id, 'raster-opacity', 1);
        });
      },
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
        this.$router.push({ name: 'tool-step-1' });
      }

      this.hiddenLayers = this.wmsLayers
        .filter((_, index) => index !== 0)
        .map((layer) => layer.id);

      if (this.$root.map) {
        const { __draw } = this.$root.map;

        __draw.changeMode('static');
      }
    },
    methods: {
      onLayerVisibilityClick(id) {
        if (this.hiddenLayers.includes(id)) {
          this.hiddenLayers = this.hiddenLayers.filter(
            (hiddenLayerId) => hiddenLayerId !== id
          );
        } else {
          this.hiddenLayers.push(id);
        }
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
