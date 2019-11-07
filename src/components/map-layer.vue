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
  destroyed() {
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
  mounted() {
    this.map = this.$parent.map;
    const oldLayer = this.map.getLayer(this.options.id);
    if (oldLayer) {
      this.map.removeLayer(this.options.id);
      try {
        this.map.removeSource(oldLayer.source);
      } catch {
        console.warn('could not remove source', oldLayer.source);
      }
    }

    this.map.addLayer(this.options);
  }
};
</script>
