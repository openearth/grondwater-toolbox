<template>
  <div class="abstraction-map">
    <mgl-map
      mapStyle="mapbox://styles/mapbox/streets-v11"
      :accessToken="mapBoxToken"
      :center="mapCenter"
      :zoom="mapZoom"
      @load="onMapCreated"
    >
      <map-legend v-if="legendSource" v-bind="legendSource"/>

      <!-- Controls -->
      <map-marker-control position="top-left" />
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
        <template v-if="viewerCurrentStepNumber === 3">
          <map-layer-info
            v-for="wmsLayer in activeLayers"
            :key="`${wmsLayer.id}-info`"
            :layer="wmsLayer"
          />
        </template>
      </template>

      <mgl-marker
        v-if="activeMarker && activeMarkerCoordinates"
        :coordinates="activeMarkerCoordinates"
        :color="activeMarker._color"
        :offset="[ 0, -18 ]"
      />

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
  import { MglMap, MglMarker, MglNavigationControl } from 'vue-mapbox';
  import Mapbox from 'mapbox-gl';

  // Shared map components
  import MapLegend from '@/components/map-components/map-legend';
  import MapPopup from '@/components/map-components/map-popup';
  import MapRasterOpacityControl from '@/components/map-components/map-raster-opacity-control';
  import MapSearch from '@/components/map-components/map-search';
  import RasterLayer from '@/components/map-components/raster-layer';

  import MapMarkerControl from './map-marker-control';
  import MapLayerInfo from './map-layer-info';

  export default {
    components: {
      MapLayerInfo,
      MapLegend,
      MapMarkerControl,
      MapPopup,
      MapRasterOpacityControl,
      MapSearch,
      MglMap,
      MglMarker,
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
      ...mapGetters('app', [ 'viewerCurrentStepNumber' ]),
      ...mapGetters('mapbox', [ 'activeMarker', 'activePopup', 'wmsLayers', 'hiddenWmsLayers' ]),
      activeLayers() {
        return this.wmsLayers.filter(layer => !this.hiddenWmsLayers.some(({ id }) => layer.id === id));
      },
      activePopupCoordinates() {
        return this.activePopup._lngLat && Object.values(this.activePopup._lngLat);
      },
      activeMarkerCoordinates() {
        return this.activeMarker._lngLat && Object.values(this.activeMarker._lngLat);
      },
      legendSource() {
        return this.activeLayers.length
          ? {
            url: this.activeLayers[0].baseUrl,
            layer: this.activeLayers[0].id,
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
  .abstraction-map {
    height: 100%;
    width: 100%;
  }

  .abstraction-map__map {
    width: 100%;
    height: 100%;
  }
</style>
