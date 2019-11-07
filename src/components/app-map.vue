<template>
  <div class="app-map">
    <v-mapbox
      class="app-map__map"
      access-token="pk.eyJ1Ijoic2lnZ3lmIiwiYSI6ImNqbHcwcHFjNjBsdGIza3F1dW5iZjhhY2EifQ.zZkkozZlSRtmB9VgpR9HiQ"
      map-style="mapbox://styles/mapbox/streets-v11"
      id="map"
      ref="map"
    >
      <!-- map controls -->
      <draw-control position="top-left" @create="onSelection" @update="onUpdateSelection" />
      <v-mapbox-navigation-control position="bottom-right" />

      <!-- map layers -->
      <map-layer v-for="feature in features" :key="feature.id" :options="feature" />
    </v-mapbox>
  </div>
</template>

<script>
import { mapMutations, mapActions, mapState } from 'vuex';
import DrawControl from './draw-control';
import MapLayer from './map-layer';

export default {
  components: {
    DrawControl,
    MapLayer
  },
  computed: {
    ...mapState({
      features: state => state.features.features
    })
  },
  mounted() {
    this.setMapLocation();
  },
  methods: {
    ...mapMutations('selections', {
      addSelection: 'add',
      updateSelection: 'update'
    }),
    ...mapActions('features', {
      getFeature: 'get'
    }),
    setMapLocation() {
      this.$refs.map.map.on('load', () => {
        this.$refs.map.map.flyTo({ center: [5.2913, 52.1326], zoom: 6.5 });
      });
    },
    onSelection(event) {
      const feature = event.features[0];
      this.addSelection(feature);
      this.getFeature(feature);
    },
    onUpdateSelection(event) {
      // TODO: update selections & features after an update
      const feature = event.features[0];
      this.updateSelection(feature);
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