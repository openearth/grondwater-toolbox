import { mapMutations, mapState } from 'vuex';
import Mapbox from 'mapbox-gl';
import getFeatureInfo from '@/lib/get-feature-info';

export default {
  name: 'map-layer-info',
  render() {
    return null;
  },
  inject: [ 'map' ],
  props: {
    layer: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapState('mapbox', [ 'activePopup' ]),
  },
  created() {
    this.addListener();
  },
  destroyed() {
    this.removeListener();
    this.removeActivePopup();
  },
  methods: {
    ...mapMutations('mapbox', [ 'setActivePopup' ]),
    removeActivePopup() {
      if (this.activePopup) {
        this.activePopup.remove();
        this.setActivePopup(null);
      }
    },
    async cb(event) {
      const bounds = this.map.getBounds();
      const canvas = this.map.getCanvas();
      const { x, y } = event.point;
      const { width, height } = canvas;

      this.removeActivePopup();

      const loadingPopup = new Mapbox.Popup()
        .setLngLat(event.lngLat)
        .setHTML('loading...')
        .addTo(this.map);

      const info = await getFeatureInfo({
        layer: this.layer.id,
        bounds,
        x,
        y,
        width,
        height,
      });

      loadingPopup.remove();

      if (info) {
        const { properties } = info;
        const { GRAY_INDEX } = properties;
        const text = GRAY_INDEX.toFixed(2);

        const popup = new Mapbox.Popup()
          .setLngLat(event.lngLat)
          .setHTML(text)
          .addTo(this.map);

        this.setActivePopup(popup);
      }
    },
    addListener() {
      this.map.on('click', this.cb);
    },
    removeListener() {
      this.map.off('click', this.cb);
    },
  },
};
