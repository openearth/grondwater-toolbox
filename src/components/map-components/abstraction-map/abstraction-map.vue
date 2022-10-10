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

      <!-- base layer -->
      <!-- TODO: add base layer -->
    </mgl-map>
  </div>
</template>

<script>
  // import { mapActions, mapGetters } from 'vuex';
  import { MglMap, MglNavigationControl } from 'vue-mapbox';
  import Mapbox from 'mapbox-gl';

  // import wms from '@/lib/mapbox/layers/wms';
  // import { generateWmsLayer } from '@/lib/project-layers';

  export default {
    components: {
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
