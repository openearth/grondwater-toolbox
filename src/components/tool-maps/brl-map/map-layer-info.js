import { mapActions, mapGetters } from 'vuex';
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
    ...mapGetters('mapbox', [ 'activePopup' ]),
  },
  created() {
    this.addListener();
  },
  destroyed() {
    this.removeListener();
    this.removeActivePopup();
  },
  methods: {
    ...mapActions('app', [ 'setToastMessage' ]),
    ...mapActions('mapbox', [ 'setActivePopup' ]),
    removeActivePopup() {
      if (this.activePopup) {
        this.activePopup.remove();
        this.setActivePopup({ popup: null });
      }
    },
    async cb(event) {
      const { x, y } = event.point;
      const bounds = this.map.getBounds();
      const canvas = this.map.getCanvas();
      const { width, height } = canvas;

      this.removeActivePopup();

      const loadingPopup = new Mapbox.Popup()
        .setLngLat(event.lngLat)
        .setHTML('Loading...')
        .addTo(this.map);

      const properties = {
        layer: this.layer.id,
        bounds,
        x,
        y,
        width,
        height,
      };

      const info = await getFeatureInfo(properties)
        .catch(err => this.setToastMessage({ text: err, type: 'error' }));

      loadingPopup.remove();

      if (info) {
        const { properties } = info;
        const { GRAY_INDEX } = properties;
        const text = GRAY_INDEX.toFixed(2);

        const popup = new Mapbox.Popup()
          .setLngLat(event.lngLat)
          .setHTML(text)
          .addTo(this.map);

        this.setActivePopup({ popup });
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
