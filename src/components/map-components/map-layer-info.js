import { mapActions, mapGetters } from 'vuex';
import Mapbox from 'mapbox-gl';
import getFeatureInfo from '@/lib/get-feature-info';
import htmlTable from '@/lib/html-table';

export default {
  name: 'map-layer-info',
  render() {
    return null;
  },
  inject: [ 'map' ],
  props: {
    layers: {
      type: Array,
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

    
      if (this.layers.length === 0) {  
        this.setToastMessage({ text: 'No layers available for feature info.', type: 'warning' });
        return;
      }
      
      const featureInfoRequests = this.layers.map(layer =>
        getFeatureInfo({
          layer: layer.id, // Pass only the string layer ID
          lng,
          lat,
          x,
          y,
          width,
          height,
        }).then(value => ({ name: layer.name, value }))
          .catch(error => ({ name: layer.name, error }))
      );

       const results = await Promise.all(featureInfoRequests);
      

      // Set popup coordinates.
      this.popup.setLngLat([ lng, lat ]);
      this.setActivePopup({ popup: { ...this.popup, content: htmlTable(results) } });
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
