import { mapActions, mapGetters } from 'vuex';
import Mapbox from 'mapbox-gl';

import getProfileData from '@/lib/get-profile-data';

export default {
  name: 'map-layer-info',
  render() {
    return null;
  },
  inject: [ 'map' ],
  data() {
    return {
      marker: null,
    };
  },
  computed: {
    ...mapGetters('mapbox', [ 'activeMarker' ]),
  },
  created() {
    this.marker = new Mapbox.Marker({
      color: '#FF0000',
      draggable: true,
    });

    this.addListeners();
  },
  destroyed() {
    this.removeListeners();
    this.removeActiveMarker();
  },
  methods: {
    ...mapActions('mapbox', [ 'setActiveMarker' ]),
    ...mapActions('abstraction', [ 'addProfile' ]),
    async getCoordinates(event) {
      const { lng, lat } = event.lngLat || event.target._lngLat;
      const canvas = this.map.getCanvas();
      const { width, height } = canvas;
      const profile = await getProfileData({ height, lng, lat, width });

      if (!profile) {
        return;
      }

      this.marker
        .setLngLat([ lng, lat ])
        .addTo(this.map);

      this.setActiveMarker({ marker: this.marker });
      this.addProfile({ profile });
    },
    addListeners() {
      this.map.on('click', this.getCoordinates);
      this.marker.on('dragend', this.getCoordinates);
    },
    removeActiveMarker() {
      this.marker.remove();

      if (this.activeMarker) {
        this.setActiveMarker({ marker: null });
      }
    },
    removeListeners() {
      this.map.off('click', this.getCoordinates);
      this.marker.off('dragend', this.getCoordinates);
    },
  },
};
