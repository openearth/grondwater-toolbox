<template>
    <div class="drainage-map">
      <mgl-map
        mapStyle="mapbox://styles/mapbox/streets-v11"
        :accessToken="mapBoxToken"
        :center="mapCenter"
        :zoom="mapZoom"
        @load="onMapCreated"
      >
        <map-legend v-if="legendSource" v-bind="legendSource"/>
  
        <!-- Controls -->
        <map-select-tool position="top-left" highlighted-tool="draw" />
        <map-search position="top-right" />
        <mgl-navigation-control position="bottom-right" />
        <map-raster-opacity-control v-if="activeLayers.length" :layers="activeLayers" />
  
        <!-- Show calculation layers when available -->
        <template v-if="activeLayers.length">
          <raster-layer
            v-for="wmsLayer in activeLayers"
            :key="wmsLayer.id"
            :layer="wmsLayer"
          />
          <map-layer-info
            v-for="wmsLayer in activeLayers"
            :key="`${wmsLayer.id}-info`"
            :layer="wmsLayer"
          />
        </template>
  
        <map-popup
          v-if="activePopup && activePopupCoordinates"
          :coordinates="activePopupCoordinates"
          showed
          :close-button="true"
          @close="onClosePopup"
        >
          {{ activePopup.content }}
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
  import MapLayerInfo from '@/components/map-components/map-layer-info';
  
  
  export default {
    components: {
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
      legendSource() {
        return this.activeLayers.length
          ? {
            url: this.activeLayers[0].baseUrl,
            layer: this.activeLayers[0].id,
          } : null;
      },
    },
    created() {
      this.mapbox = Mapbox;
    },
    methods: {
      ...mapActions('mapbox', [ 'setActivePopup' ]),
      ...mapActions('selections', [ 'addSelection', 'updateSelection' ]),
      onClosePopup() {
        if (this.activePopup) {
          this.setActivePopup({ popup: null });
        }
      },
      onMapCreated({ map }) {
        this.$root.map = map;
      },
      onSelection(event) {
        const feature = event.features[0];
        this.addSelection({ selection: feature });
  
      },
      onUpdateSelection(event) {
        const feature = event.features[0];
  
        if (!this.selections.length) {
          this.addSelection({ selection: feature });
        } else {
          this.updateSelection({ selection: feature });
        }
      },
    },
  };
  </script>
  
  <style>
    .drainage-map {
      width: 100%;
      height: 100%;
    }
  
    .drainage-map__map {
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
  
