<template>
  <div class="app-map">
    <mgl-map
      mapStyle="mapbox://styles/mapbox/streets-v11"
      :accessToken="mapBoxToken"
      :center="mapCenter"
      :zoom="mapZoom"
      @load="onMapCreated"
    >
      <!-- controls -->
      <map-draw-control
        position="top-left"
        @create="onSelection"
        @update="onUpdateSelection"
      />
      <map-search position="top-right" />
      <mgl-navigation-control position="bottom-right" />
     
      <!-- base layer -->
      <raster-layer :layer="waterWaysLayer"/>

      <!-- selected area layers -->
      <raster-layer
        v-if="!wmsLayers.length"
        v-for="feature in features"
        :key="feature.id"
        :layer="feature"
      />
      <raster-layer
        v-for="wmsLayer in wmsLayers"
        :key="wmsLayer.id"
        :layer="wmsLayer"
       />
    </mgl-map>
  </div>
</template>

<script>
import { mapMutations, mapActions, mapState } from 'vuex';
import Mapbox from "mapbox-gl";
import { MglMap, MglNavigationControl } from "vue-mapbox";
import RasterLayer from "./raster-layer";
import MapSearch from "./map-search";
import MapDrawControl from './map-draw-control';
import wms from '../../lib/mapbox/layers/wms';
import { generateWmsLayer } from '../../lib/project-layers';

export default {
  components: {
    MglMap,
    RasterLayer,
    MapDrawControl,
    MglNavigationControl,
    MapSearch
  },
  data() {
    return {
      mapZoom: 6.5,
      mapCenter: [5.2913, 52.1326],
      waterWaysLayer: Object.freeze(
        wms({
          ...generateWmsLayer({
            url: 'https://geoservices.rijkswaterstaat.nl/apps/geoserver/nwb_vaarwegen/wms',
            id: 'water-ways',
            layer: 'nwb_vaarwegen:vaarwegvakken'
          }).source,
          id: 'water-ways'
        })
      ),
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
  created() {
    this.mapbox = Mapbox;
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
    onMapCreated({ map }) {
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
