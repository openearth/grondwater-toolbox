<template>
  <div class="app-map">
    <mgl-map
      mapStyle="mapbox://styles/mapbox/streets-v11"
      :accessToken="mapBoxToken"
      :center="mapCenter"
      :zoom="mapZoom"
      @load="onMapCreated"
    >
      <map-legend v-if="legendSource" v-bind="legendSource"/>

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

      <!-- Show Selection Layers Before Calculation -->
      <template v-if="!wmsLayers.length">
        <raster-layer
          v-for="feature in features"
          :key="feature.watersIdentifier"
          :layer="feature"
        />
      </template>
      <!-- Show Calculation Layers when available-->
      <template v-else>
        <raster-layer
          v-for="wmsLayer in wmsLayers"
          :key="wmsLayer.id"
          :layer="wmsLayer"
        />
       </template>

    </mgl-map>
  </div>
</template>

<script>
import { mapMutations, mapActions, mapState } from 'vuex';
import Mapbox from "mapbox-gl";
import { MglMap, MglNavigationControl } from "vue-mapbox";
import RasterLayer from "./raster-layer";
import MapSearch from "./map-search";
import MapLegend from "./map-legend";
import MapDrawControl from './map-draw-control';
import wms from '../../lib/mapbox/layers/wms';
import { generateWmsLayer } from '../../lib/project-layers';

export default {
  components: {
    MglMap,
    RasterLayer,
    MapDrawControl,
    MglNavigationControl,
    MapSearch,
    MapLegend
  },
  data() {
    return {
      mapZoom: 6.5,
      mapCenter: [5.2913, 52.1326],
      waterWaysUrl: process.env.VUE_APP_WATERWAYS_WMS,
      waterWaysLayerId: 'nwb_vaarwegen:vaarwegvakken',
    };
  },
  computed: {
    ...mapState({
      features: state => state.mapbox.features,
      wmsLayers: state => state.mapbox.wmsLayers
    }),
    mapBoxToken() {
      return process.env.VUE_APP_MAPBOX_TOKEN;
    },
    firstWmsLayer() {
      return this.wmsLayers[0];
    },
    legendSource() {
      if (this.firstWmsLayer) {
        return {
          url: this.firstWmsLayer.baseUrl,
          layer: this.firstWmsLayer.id
        };
      }

      return null;
    },
    waterWaysLayer() {
      return wms({
        ...generateWmsLayer({
          url: this.waterWaysUrl,
          id: 'water-ways',
          layer: this.waterWaysLayerId
        }).source,
        id: 'water-ways'
      });
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
