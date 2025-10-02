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
      highlighted: {
        type: Boolean,
      },
    },
    data() {
      return {
        button: null,
        marker: null,
        enabled: false,
        staticMode: false,
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
        className: `mapbox-gl-marker-control ${ this.highlighted ? 'mapbox-gl-marker-control--highlighted' : '' }`,
        icon: 'mdi-map-marker',
        eventHandler: this.toggleMarker,
        title: 'Plaats een speld op de kaart',
      });

      this.map.addControl(control, this.position);
      this.button = control;
      
      // Attach marker control to map for external access (similar to __draw)
      this.map.__markerControl = this;
    },
    destroyed() {
      this.disableControl();
      this.removeActiveMarker();
      
      // Clean up the reference to this control
      if (this.map && this.map.__markerControl === this) {
        this.map.__markerControl = null;
      }
    },
    beforeDestroy() {
      // Ensure control is disabled when component is destroyed
      this.setStaticMode(false);
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

        // Save active marker to store.
        this.setActiveMarker({ marker: this.marker });
      },
      enableControl() {
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
        // Don't allow toggling when in static mode
        if (this.staticMode) {
          return;
        }
        this.$emit('toggle', !this.active);
      },
      setStaticMode(enabled) {
        this.staticMode = enabled;
        
        if (this.button && this.button._container) {
          const buttonElement = this.button._container.querySelector('button');
          if (buttonElement) {
            if (enabled) {
              buttonElement.setAttribute('disabled', true);
              buttonElement.style.opacity = '0.5';
              buttonElement.style.cursor = 'not-allowed';
            } else {
              buttonElement.removeAttribute('disabled');
              buttonElement.style.opacity = '';
              buttonElement.style.cursor = '';
            }
          }
        }
        
        // If enabling static mode and control is currently active, disable it
        if (enabled && this.active) {
          this.disableControl();
          this.$emit('toggle', false);
        }
      },
    },
    watch: {
      '$route'() {
        this.disableControl();
        this.enabled = false;
      },
      active(value) {
        // Don't allow activation when in static mode
        if (value && this.staticMode) {
          this.$emit('toggle', false);
          return;
        }
        
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

  .mapbox-gl-marker-control i::before {
    color: #000;
  }

  .mapbox-gl-marker-control--highlighted {
    background: #008fc5 !important;
    border-radius: 4px;
  }

  .mapbox-gl-marker-control--highlighted i::before {
    color: #fff;
  }

  .mapbox-gl-marker-control:disabled {
    opacity: 0.5 !important;
    cursor: not-allowed !important;
  }

  .mapbox-gl-marker-control:disabled i::before {
    color: #999 !important;
  }
</style>
