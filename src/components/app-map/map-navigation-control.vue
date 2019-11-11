<script>
import mapboxgl from 'mapbox-gl';

export default {
  name: 'v-mapbox-navigation-control',
  render() {
    return null;
  },
  data () {
    return {
    };
  },
  props: {
    options: {
      // options passed to the navigation control
      default: () => {
        return {};
      },
      type: Object
    },
    position: {
      // see https://docs.mapbox.com/mapbox-gl-js/api/#map#addcontrol for posible values
      type: String,
      required: false
    }
  },
  mounted () {
  },
  methods: {
    deferredMountedTo(map) {
      let control = new mapboxgl.NavigationControl(this.options);
      map.addControl(control, this.position);
      const $zoomInButton = document.querySelector('.mapboxgl-ctrl-zoom-in');
      const $zoomOutButton = document.querySelector('.mapboxgl-ctrl-zoom-out');
      const $compassButton = document.querySelector('.mapboxgl-ctrl-compass');
      [$zoomInButton, $zoomOutButton, $compassButton].forEach($el => {
        $el.classList.add('map-control-tooltip', 'map-control-tooltip--left');
      });
    }
  }
};
</script>
