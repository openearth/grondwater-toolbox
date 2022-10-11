<template>
  <div class="abstraction-map">
    <mgl-map
      mapStyle="mapbox://styles/mapbox/streets-v11"
      :accessToken="mapBoxToken"
      :center="mapCenter"
      :zoom="mapZoom"
      @load="onMapCreated"
    >
      <!-- controls -->
      <mgl-navigation-control position="bottom-right" />

      <map-layer-info v-if="mapIsActive" />
    </mgl-map>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import { MglMap, MglNavigationControl } from 'vue-mapbox';
  import Mapbox from 'mapbox-gl';

  import MapLayerInfo from './map-layer-info';

  export default {
    components: {
      MapLayerInfo,
      MglMap,
      MglNavigationControl,
    },
    data() {
      return {
        mapZoom: 6.5,
        mapCenter: [ 5.2913, 52.1326 ],
      };
    },
    computed: {
      ...mapGetters('mapbox', [ 'mapIsActive' ]),
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
  }

  .brl-map__map {
    width: 100%;
    height: 100%;
  }
</style>
