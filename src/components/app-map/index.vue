<template>
  <div class="app-map">
    <map-mapbox
      class="app-map__map"
      :access-token="mapBoxToken"
      map-style="mapbox://styles/mapbox/streets-v11"
      id="map"
      ref="map"
      @mb-created="onMapCreated"
    >
      <!-- map controls -->
      <map-draw-control
        position="top-left"
        @create="onSelection"
        @update="onUpdateSelection"
        :options="drawOptions"
      />
      <map-navigation-control position="bottom-right" />
      <map-search />

      <!-- map layers -->
      <map-layer
        v-if="!wmsLayers.length"
        v-for="feature in features"
        :key="feature.id"
        :options="feature"
      />
      <map-layer v-for="wmsLayer in wmsLayers" :key="wmsLayer.id" :options="wmsLayer" />

      <!-- default layers -->
      <map-layer :options="waterWaysLayer" />
    </map-mapbox>
  </div>
</template>

<script>
import { mapMutations, mapActions, mapState } from 'vuex';
import MapMapbox from './map-mapbox';
import MapDrawControl from './map-draw-control';
import MapNavigationControl from './map-navigation-control';
import MapLayer from './map-layer';
import MapSearch from './map-search';
import wms from '../../lib/mapbox/layers/wms';
import { generateWmsLayer } from '../../lib/project-layers';

export default {
  components: {
    MapMapbox,
    MapDrawControl,
    MapNavigationControl,
    MapLayer,
    MapSearch
  },
  data() {
    return {
      drawOptions: {
        styles: [{
          'id': 'gl-draw-polygon-fill-inactive',
          'type': 'fill',
          'filter': ['all', ['==', 'active', 'false'],
            ['==', '$type', 'Polygon'],
            ['!=', 'mode', 'static']
          ],
          'paint': {
            'fill-color': '#ffcc00',
            'fill-outline-color': '#3bb2d0',
            'fill-opacity': 0.1
          }
        }]
      },
      waterWaysLayer: Object.freeze(
        wms({
          ...generateWmsLayer({
            url: 'https://geoservices.rijkswaterstaat.nl/apps/geoserver/nwb_vaarwegen/wms',
            id: 'water-ways',
            layer: 'nwb_vaarwegen:vaarwegvakken'
          }).source,
          id: 'water-ways'
        })
      )
    };
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
    this.setMapLocation();
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
    onMapCreated(map) {
      this.$root.map = map;
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
    },
    setMapLocation() {
      const { map } = this.$root;

      map.on('load', () => {
        map.flyTo({ center: [5.2913, 52.1326], zoom: 6.5 });
      });
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
