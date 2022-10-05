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
      <map-raster-opacity-control
        v-if="wmsLayers.length"
        :layers="wmsLayers"
      />

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
        <map-layer-info
          v-for="wmsLayer in wmsLayers"
          :key="`${wmsLayer.id}-info`"
          :layer="wmsLayer"
        />
      </template>

    </mgl-map>
  </div>
</template>

<script>
  import { mapMutations, mapActions, mapState } from 'vuex';
  import Mapbox from 'mapbox-gl';
  import { MglMap, MglNavigationControl } from 'vue-mapbox';
  import MapRasterOpacityControl from './map-raster-opacity-control';
  import RasterLayer from './raster-layer';
  import MapSearch from './map-search';
  import MapLegend from './map-legend';
  import MapLayerInfo from './map-layer-info';
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
      MapLegend,
      MapLayerInfo,
      MapRasterOpacityControl,
    },
    data() {
      return {
        mapZoom: 6.5,
        mapCenter: [ 5.2913, 52.1326 ],
        waterWaysUrl: `${ process.env.VUE_APP_GEO_SERVER }/geoserver/vaarwegvakken/wms`,
        waterWaysLayerId: 'nwb_vaarwegen:vaarwegvakken',
      };
    },
    computed: {
      ...mapState('mapbox', [ 'features', 'wmsLayers' ]),
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
            layer: this.firstWmsLayer.id,
          };
        } else {
          return {
            url: this.waterWaysUrl,
            layer: this.waterWaysLayerId,
          };
        }
      },
      waterWaysLayer() {
        return wms({
          ...generateWmsLayer({
            url: this.waterWaysUrl,
            id: 'water-ways',
            layer: this.waterWaysLayerId,
          }).source,
          id: 'water-ways',
        });
      },
    },
    created() {
      this.mapbox = Mapbox;
    },
    methods: {
      ...mapActions('mapbox', [ 'getFeature' ]),
      ...mapActions('selections', [ 'addSelection', 'updateSelection' ]),
      ...mapMutations('mapbox', [ 'removeFeature' ]),
      onMapCreated({ map }) {
        this.$root.map = map;
      },
      onSelection(event) {
        const feature = event.features[0];
        this.addSelection({ selection: feature });
        this.getFeature(feature);
      },
      onUpdateSelection(event) {
        const feature = event.features[0];
        this.updateSelection({ selection: feature });
        this.removeFeature(feature.id);
        this.getFeature(feature);
      },
    },
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

.mapboxgl-popup-close-button {
  position: absolute;
  width: 1rem;
  height: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  right: -0.5rem;
  top: -0.5rem;
  background-color: #ededed;
  border-radius: 0.5rem;
}

.mapboxgl-popup-close-button:hover {
  background-color: #d5d5d5;
}
</style>
