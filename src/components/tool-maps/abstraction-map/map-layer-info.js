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
  data() {
    return {
      popup: null,
    };
  },
  computed: {
    ...mapGetters('mapbox', [ 'activePopup' ]),
  },
  created() {
    this.addListener();

    this.popup = new Mapbox.Popup({ anchor: 'bottom' });
  },
  destroyed() {
    this.removeListener();
    this.removeActivePopup();
  },
  methods: {
    ...mapActions('app', [ 'setToastMessage' ]),
    ...mapActions('mapbox', [ 'setActivePopup' ]),
    addListener() {
      this.map.on('click', this.getDepth);
    },
    async getDepth(event) {
      const { lng, lat } = event.lngLat || event.target._lngLat;
      const { x, y } = event.point;
      const canvas = this.map.getCanvas();
      const { width, height } = canvas;

      this.removeActivePopup();
      this.setActivePopup({ popup: null });

      // Show the user we're loading data.
      this.popup.setLngLat([ lng, lat ]);
      this.setActivePopup({ popup: { ...this.popup, content: 'Loading...' } });

      const properties = {
        layer: this.layer.id,
        lng, lat,
        x, y,
        width, height,
      };

      const info = await getFeatureInfo(properties)
        .catch(err => this.setToastMessage({ text: err, type: 'error' }));

      if (!info) {
        return;
      }

      const { GRAY_INDEX } = info.properties;
      const text = GRAY_INDEX.toFixed(2);

      // Set popup coordinates.
      this.popup.setLngLat([ lng, lat ]);
      this.setActivePopup({ popup: { ...this.popup, content: text } });
    },
    removeListener() {
      this.map.off('click', this.getDepth);
    },
    removeActivePopup() {
      this.popup.remove();

      if (this.activePopup) {
        this.setActivePopup({ popup: null });
      }
    },
  },
};
