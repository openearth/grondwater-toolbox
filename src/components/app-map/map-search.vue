<script>
  import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
  import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

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
    created() {
      const geocoder = new MapboxGeocoder({
        accessToken: process.env.VUE_APP_MAPBOX_TOKEN,
        marker: false,
        position: this.position,
      });

      this.map.addControl(geocoder);
    },
  };
</script>

<style>
  .mapboxgl-ctrl-geocoder {
    box-shadow: 0 0 5px 2px rgba(0, 0, 0, .12);
  }
</style>
