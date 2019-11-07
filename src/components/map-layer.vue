<script>
export default {
  name: 'v-mapbox-layer',
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
  destroyed() {
    this.removeLayer();
  },
  mounted() {
    this.map = this.$parent.map;
    this.removeLayer();
    this.addLayer();
  },
  methods: {
    removeLayer() {
      const layer = this.map.getLayer(this.options.id);

      if (layer) {
        this.map.removeLayer(this.options.id);
        try {
          this.map.removeSource(layer.source);
        } catch {
          console.warn('could not remove source', layer.source);
        }
      }
    },
    addLayer() {
      this.map.addLayer(this.options);
    }
  }
};
</script>
