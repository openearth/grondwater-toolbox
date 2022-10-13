<script>
  import { mapActions, mapGetters } from 'vuex';
  import Mapbox from 'mapbox-gl';

  import getProfileData from '@/lib/get-profile-data';
  import MapboxButtonControl from '@/lib/mapbox-button-control';

  export default {
    inject: [ 'map' ],
    render() {
      return null;
    },
    props: {
      position: {
        type: String,
        required: false,
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
      ...mapGetters('mapbox', [ 'activeMarker' ]),
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
      ...mapActions('app', [ 'setToastMessage' ]),
      ...mapActions('mapbox', [ 'setActiveMarker', 'resetWmsLayers' ]),
      ...mapActions('abstraction', [ 'addProfile' ]),
      async getCoordinates(event) {
        this.resetWmsLayers();
        const { lng, lat } = event.lngLat || event.target._lngLat;
        const canvas = this.map.getCanvas();
        const { width, height } = canvas;
        const profile = await getProfileData({ height, lng, lat, width })
          .catch(err => this.setToastMessage({ text: err, type: 'error' }));

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
        if (this.enabled) {
          this.disableControl();
        } else {
          this.enableControl();
        }

        this.enabled = !this.enabled;
      },
    },
  };
</script>

<style>
  .mapboxgl-ctrl-icon.mapbox-gl-marker-control.map-control-tooltip.map-control-tooltip--right.active {
    box-shadow: 0 0 2px 2px rgba(0, 150, 255, 1), inset 0 0 0 3px rgba(0, 150, 255, 1);
  }
</style>
