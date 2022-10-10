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
  import { mapActions, mapGetters } from 'vuex';
  import Mapbox from 'mapbox-gl';
  import { MglMap, MglNavigationControl } from 'vue-mapbox';

  import MapDrawControl from './map-draw-control';
  import MapLayerInfo from './map-layer-info';
  import MapLegend from './map-legend';
  import MapRasterOpacityControl from './map-raster-opacity-control';
  import MapSearch from './map-search';
  import RasterLayer from './raster-layer';

  import wms from '@/lib/mapbox/layers/wms';
  import { generateWmsLayer } from '@/lib/project-layers';

  export default {
    components: {
      MapDrawControl,
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
        waterWaysUrl: `${ process.env.VUE_APP_GEO_SERVER }/geoserver/vaarwegvakken/wms`,
        waterWaysLayerId: 'nwb_vaarwegen:vaarwegvakken',
      };
    },
    computed: {
      ...mapGetters('mapbox', [ 'features', 'wmsLayers' ]),
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
      ...mapActions('mapbox', [ 'getFeature', 'removeFeature' ]),
      ...mapActions('selections', [ 'addSelection', 'updateSelection' ]),
      onMapCreated({ map }) {
        this.$root.map = map;
      },
      onSelection(event) {
        const feature = event.features[0];
        this.addSelection({ selection: feature });
        this.getFeature({ feature });
      },
      onUpdateSelection(event) {
        const feature = event.features[0];
        this.updateSelection({ selection: feature });
        this.removeFeature({ id: feature.id });
        this.getFeature({ feature });
      },
    },
  };
</script>

<style>
.app-map {
  width: 100%;
  height: 100%;
}

.app-map__map {
  width: 100%;
  height: 100%;
}

.mapboxgl-popup-content {
  box-shadow: 0 0 5px 2px rgba(0, 0, 0, .3);
}

.mapboxgl-popup-close-button {
  position: absolute;
  top: -12px;
  right: -12px;
  width: 24px;
  height: 24px;
  padding-bottom: 2px;
  border-radius: 50%;
  background-color: #ededed;
  font-size: 1.25rem;
  line-height: 0;
}

.mapboxgl-popup-close-button:hover {
  background-color: #d5d5d5;
}
</style>
