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
    this.addListener();

    this.marker = new Mapbox.Marker({
      color: '#FF0000',
      draggable: true,
    });

    this.marker.on('dragend', this.getCoordinates);
  },
  destroyed() {
    this.removeListener();
    this.removeActiveMarker();
  },
  methods: {
    ...mapActions('mapbox', [ 'setActiveMarker' ]),
    async getCoordinates(event) {
      const { lng, lat } = event.lngLat || event.target._lngLat;
      const info = await getProfileData({ lng, lat });

      if (info) {
        console.log(info);
      }

      this.marker
        .setLngLat([ lng, lat ])
        .addTo(this.map);

      this.setActiveMarker({ marker: this.marker });
    },
    addListener() {
      this.map.on('click', this.getCoordinates);
    },
    removeActiveMarker() {
      if (this.activeMarker) {
        this.activeMarker.remove();
        this.setActiveMarker({ marker: null });
      }
    },
    removeListener() {
      this.map.off('click', this.getCoordinates);
      this.marker.off('dragend', this.getCoordinates);
    },
  },
};
