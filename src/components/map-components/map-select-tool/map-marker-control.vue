<template>
  <mgl-marker
    v-if="activeMarker && activeMarkerCoordinates"
    :coordinates="activeMarkerCoordinates"
    :color="activeMarker._color"
    :offset="[ 0, -18 ]"
  />
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';
  import Mapbox from 'mapbox-gl';
  import { MglMarker } from 'vue-mapbox';

  import getProfileData from '@/lib/get-profile-data';
  import MapboxButtonControl from '@/lib/mapbox-button-control';

  export default {
    inject: [ 'map' ],
    components: {
      MglMarker,
    },
    props: {
      position: {
        type: String,
        required: false,
      },
      active: {
        type: Boolean,
      },
    },
    data() {
      return {
        button: null,
        marker: null,
        enabled: false,
      };
    },
    computed: {
      ...mapGetters('app', [ 'viewerCurrentStepNumber' ]),
      ...mapGetters('mapbox', [ 'activeMarker' ]),

      activeMarkerCoordinates() {
        return this.activeMarker._lngLat && Object.values(this.activeMarker._lngLat);
      },
    },
    created() {
      this.resetWmsLayers();

      this.marker = new Mapbox.Marker({
        color: '#FF0000',
      });

      const control = new MapboxButtonControl({
        className: 'mapbox-gl-marker-control',
        icon: 'mdi-map-marker',
        eventHandler: this.toggleMarker,
        title: 'Plaats een speld op de kaart',
      });

      this.map.addControl(control, this.position);
    },
    destroyed() {
      this.disableControl();
      this.removeActiveMarker();
    },
    methods: {
      ...mapActions('abstraction', [ 'addProfile', 'removeProfile' ]),
      ...mapActions('app', [ 'setToastMessage' ]),
      ...mapActions('mapbox', [ 'setActiveMarker', 'setActivePopup', 'resetWmsLayers' ]),
      async getCoordinates(event) {
        this.setActivePopup({ popup: null });
        this.resetWmsLayers();
        this.removeProfile();

        const { lng, lat } = event.lngLat || event.target._lngLat;
        const canvas = this.map.getCanvas();
        const { width, height } = canvas;
        const profile = await getProfileData({ height, lng, lat, width })
          .catch(err => this.$emit('error', err));

        if (!profile) {
          return;
        }

        this.addProfile({ profile });
        // Set marker coordinates.
        this.marker.setLngLat([ lng, lat ]);
        console.log(this.marker);
        // Save active marker to store.
        this.setActiveMarker({ marker: this.marker });
      },
      enableControl() {
        console.log('enable marker add');
        this.map.on('click', this.getCoordinates);
        this.map.getCanvas().style.cursor = 'crosshair';
      },
      disableControl() {
        this.map.off('click', this.getCoordinates);
        this.map.getCanvas().style.cursor = 'unset';
      },
      removeActiveMarker() {
        this.marker.remove();

        if (this.activeMarker) {
          this.setActiveMarker({ marker: null });
        }
      },
      toggleMarker() {
        console.log('toggleMarker');
        this.$emit('toggle', !this.active);
      },
    },
    watch: {
      '$route'() {
        this.disableControl();
        this.enabled = false;
      },
      active(value) {
        console.log('Marker draw mode', value);
        if (value) {
          this.enableControl();
        } else {
          this.disableControl();
        }
      },
    },
  };
</script>

<style>
  .mapboxgl-ctrl-icon.mapbox-gl-marker-control.map-control-tooltip.map-control-tooltip--right.active {
    box-shadow: 0 0 2px 2px rgba(0, 150, 255, 1), inset 0 0 0 3px rgba(0, 150, 255, 1);
  }
</style>
