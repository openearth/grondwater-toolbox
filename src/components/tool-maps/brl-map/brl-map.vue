<template>
  <div class="brl-map">
    <mgl-map
        mapStyle="mapbox://styles/mapbox/streets-v11"
        :accessToken="mapBoxToken"
        :center="mapCenter"
        :zoom="mapZoom"
        @load="onMapCreated"
    >
      <map-legend v-if="legendSource" v-bind="legendSource" />
      <map-levels v-model="systemLayers" />

      <map-select-tool position="top-left" highlighted-tool="draw" />

      <map-search position="top-right" />
      <mgl-navigation-control position="bottom-right" />
      <map-raster-opacity-control v-if="activeLayers.length" :layers="activeLayers" />

      <!-- System layers -->
        <raster-layer
            v-for="layer in activeSystemLayers"
            :key="layer.id"
            :layer="layer"
            before="gl-draw-polygon-fill-inactive.cold" 
        />
      <!-- Show calculation layers when available -->
      <template v-if="activeLayers.length">
        <raster-layer
            v-for="wmsLayer in activeLayers"
            :key="wmsLayer.id"
            :layer="wmsLayer"
            before="gl-draw-polygon-fill-inactive.cold"
        />
       <map-layer-info
            :layers="activeLayers"
          />
      </template>

      <map-popup
          v-if="activePopup && activePopupCoordinates"
          :coordinates="activePopupCoordinates"
          showed
          :content="activePopup.content"
          :close-button="true"
          @close="onClosePopup"
      >
      </map-popup>
    </mgl-map>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';
  import { MglMap, MglNavigationControl } from 'vue-mapbox';
  import Mapbox from 'mapbox-gl';

  // Shared map components
  import MapLegend from '@/components/map-components/map-legend';
  import MapPopup from '@/components/map-components/map-popup';
  import MapRasterOpacityControl from '@/components/map-components/map-raster-opacity-control';
  import MapSearch from '@/components/map-components/map-search';
  import MapSelectTool from '@/components/map-components/map-select-tool';
  import RasterLayer from '@/components/map-components/raster-layer';
  import MapLevels from '@/components/map-components/map-levels.vue';
  import MapLayerInfo from '@/components/map-components/map-layer-info';
  
  import wms from '@/lib/mapbox/layers/wms';
  import { generateWmsLayer } from '@/lib/project-layers';

  export default {
    components: {
      MapLevels,
      MapSelectTool,
      MapLayerInfo,
      MapLegend,
      MapPopup,
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
        waterWaysUrl: `${ process.env.VUE_APP_GEOSERVER_BASE_URL }/vaarwegvakken/wms`,
        waterSystemsUrl: `${ process.env.VUE_APP_GEOSERVER_BASE_URL }/basisdata/wms`,
        waterWaysLayerId: 'nwb_vaarwegen:vaarwegvakken',
        systemLayers: {
          main: {
            label: 'Hoofd',
            layer: 'basisdata:ligging_hoofd_watersysteem',
            active: false,
          },
          primary: {
            label: 'Primair',
            layer: 'basisdata:ligging_primair_watersysteem',
            active: false,
          },
          secondary: {
            label: 'Secundair',
            layer: 'basisdata:ligging_secundair_watersysteem',
            active: false,
          },
          tertiary: {
            label: 'Tertiair',
            layer: 'basisdata:ligging_tertiair_watersysteem',
            active: false,
          },
        },
      };
    },
    computed: {
      ...mapGetters('mapbox', [ 'activePopup', 'features', 'wmsLayers', 'hiddenWmsLayers' ]),
      ...mapGetters('selections', [ 'selections' ]),
      activeLayers() {
        return this.wmsLayers.filter(layer => !this.hiddenWmsLayers.some(({ id }) => layer.id === id));
      },
      activePopupCoordinates() {
        return this.activePopup._lngLat && Object.values(this.activePopup._lngLat);
      },
      mapBoxToken() {
        return process.env.VUE_APP_MAPBOX_TOKEN;
      },
      firstWmsLayer() {
        return this.wmsLayers[0];
      },
      legendSource() {
        return this.activeLayers.length
          ? {
            url: this.activeLayers[0].baseUrl,
            layer: this.activeLayers[0].id,
          } : null;
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
      activeSystemLayers() {
        return Object.values(this.systemLayers)
          .filter(({ active }) => active)
          .map(({ layer }) => wms({
            ...generateWmsLayer({
              url: this.waterSystemsUrl,
              id: `water-systems-${ layer }`,
              layer,
            }).source,
            id: `water-systems-${ layer }`,
          }));
      },
    },

    created() {
      this.mapbox = Mapbox;
    },
    methods: {
      ...mapActions('mapbox', [ 'setActivePopup' ]),
      onClosePopup() {
        if (this.activePopup) {
          this.setActivePopup({ popup: null });
        }
      },
      onMapCreated({ map }) {
        this.$root.map = map;
      },
    },
  };
</script>

<style>
.brl-map {
  width: 100%;
  height: 100%;
}

.brl-map__map {
  width: 100%;
  height: 100%;
}

.mapboxgl-popup-content {
  width: 320px !important; /* or 400px */
  max-width: none;
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
