<script>
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

export default {
  render() {
    return null;
  },
  props: {
    options: {
      type: Object,
      required: false
    }
  },
  methods: {
    deferredMountedTo(map) {
      const geocoder = new MapboxGeocoder({
        accessToken: process.env.VUE_APP_MAPBOX_TOKEN,
        marker: false,
        ...this.options
      });
      map.addControl(geocoder);
    }
  }
};
</script>