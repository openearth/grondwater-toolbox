<template>
  <div class="app-map">
    <v-mapbox
      class="app-map__map"
      :access-token="mapBoxToken"
      map-style="mapbox://styles/mapbox/streets-v11"
      id="map"
      ref="map"
    >
      <!-- map controls -->
      <draw-control position="top-left" @create="onSelection" @update="onUpdateSelection" />
      <v-mapbox-navigation-control position="bottom-right" />

      <!-- map layers -->
      <map-layer v-for="feature in features" :key="feature.id" :options="feature" />
      <map-layer v-for="wmsLayer in wmsLayers" :key="wmsLayer.id" :options="wmsLayer" />
    </v-mapbox>
  </div>
</template>

<script>
import { mapMutations, mapActions, mapState } from 'vuex';
import DrawControl from './map-draw-control';
import MapLayer from './map-layer';

export default {
  components: {
    DrawControl,
    MapLayer
  },
  computed: {
    ...mapState({
      features: state => state.mapbox.features,
      wmsLayers: state => state.mapbox.wmsLayers
    }),
    mapBoxToken() {
      return process.env.VUE_APP_MAPBOX_TOKEN;
    }
  },
  mounted() {
    const map = this.$refs.map.map;
    // this.$root.getMap = () => map;
    console.log(map);
    this.setMapLocation(map);
  },
  methods: {
    ...mapMutations('selections', {
      addSelection: 'add',
      updateSelection: 'update'
    }),
    ...mapActions('mapbox', {
      getFeature: 'getFeature',
      updateFeature: 'updateFeature'
    }),
    setMapLocation(map) {
      map.on('load', () => {
        map.flyTo({ center: [5.2913, 52.1326], zoom: 6.5 });
      });
    },
    onSelection(event) {
      const feature = event.features[0];
      this.addSelection(feature);
      this.getFeature(feature);
    },
    onUpdateSelection(event) {
      const feature = event.features[0];
      this.updateSelection(feature);
      this.updateFeature(feature);
    }
  }
};
</script>

<style>
.app-map {
  height: 100%;
  width: 100%;
}

.app-map__map {
  height: 100%;
  width: 100%;
}
</style>
