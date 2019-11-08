<script>
export default {
  name: 'v-mapbox-layer',
  inject: ['getMap'],
  render() {
    return null;
  },
  data() {
    return {
      map: null
    };
  },
  props: {
    options: {
      default: () => {
        return {};
      },
      type: [Object, String]
    }
  },
  watch: {
    options: {
      deep: true,
      handler() {
        this.removeLayer();
        this.addLayer();
      }
    }
  },
  mounted() {
    this.removeLayer();
    this.addLayer();
  },
  destroyed() {
    this.removeLayer();
  },
  methods: {
    removeLayer() {
      const map = this.getMap();
      const layer = map.getLayer(this.options.id);

      if (layer) {
        map.removeLayer(this.options.id);
        try {
          map.removeSource(layer.source);
        } catch {
          console.warn('could not remove source', layer.source);
        }
      }
    },
    addLayer() {
      this.getMap().addLayer(this.options);
    }
  }
};
</script>
