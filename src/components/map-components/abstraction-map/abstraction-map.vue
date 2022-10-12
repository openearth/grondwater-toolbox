<template>
  <div
    class="abstraction-map"
    :class="{ 'abstraction-map--is-acive': mapIsActive }"
  >
    <mgl-map
      mapStyle="mapbox://styles/mapbox/streets-v11"
      :accessToken="mapBoxToken"
      :center="mapCenter"
      :zoom="mapZoom"
      @load="onMapCreated"
    >
      <map-legend v-if="legendSource" v-bind="legendSource"/>

      <!-- Controls -->
      <map-search position="top-right" />
      <mgl-navigation-control position="bottom-right" />
      <map-raster-opacity-control v-if="wmsLayers.length" :layers="wmsLayers" />

      <!-- Show calculation layers when available -->
      <template v-if="wmsLayers.length">
        <raster-layer
          v-for="wmsLayer in wmsLayers"
          :key="wmsLayer.id"
          :layer="wmsLayer"
        />
      </template>

      <map-layer-info />
    </mgl-map>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import { MglMap, MglNavigationControl } from 'vue-mapbox';
  import Mapbox from 'mapbox-gl';

  // Shared map components
  import MapLegend from '../map-legend';
  import MapRasterOpacityControl from '../map-raster-opacity-control';
  import MapSearch from '../map-search';
  import RasterLayer from '../raster-layer';

  import MapLayerInfo from './map-layer-info';

  export default {
    components: {
      MapLayerInfo,
      MapLegend,
      MapRasterOpacityControl,
      MapSearch,
      MglMap,
      MglNavigationControl,
      RasterLayer,
    },
    data() {
      return {
        mapZoom: 6.5,
        mapCenter: [ 5.2913, 52.1326 ],
      };
    },
    computed: {
      ...mapGetters('mapbox', [ 'mapIsActive', 'wmsLayers' ]),
      legendSource() {
        return this.wmsLayers.length
          ? {
            url: this.wmsLayers[0].baseUrl,
            layer: this.wmsLayers[0].id,
          } : null;
      },
      mapBoxToken() {
        return process.env.VUE_APP_MAPBOX_TOKEN;
      },
    },
    created() {
      this.mapbox = Mapbox;
    },
    methods: {
      onMapCreated({ map }) {
        this.$root.map = map;
      },
    },
  };
</script>


<style>
  .abstraction-map {
    height: 100%;
    width: 100%;
    pointer-events: none;
  }

  .abstraction-map--is-acive {
    pointer-events: all;
  }

  .brl-map__map {
    width: 100%;
    height: 100%;
  }
</style>
