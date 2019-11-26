<template>
  <mgl-raster-layer
    ref="pathLayer"
    :source-id="`${layer.id}-source`"
    :layer-id="`${layer.id}-layer`"
    :layer="layer"
    v-bind="$attrs"
  />
</template>

<script>
import { MglRasterLayer } from "vue-mapbox";

export default {
  inject: ['map'],
  components: {
    MglRasterLayer
  },
  props: {
    layer: {
      type: Object,
      required: true
    }
  },
  beforeMount() {
    if (this.map.getLayer(this.layer.id)) {
      this.removeLayer();
    }
  },
  methods: {
    removeLayer() {
      this.map.removeLayer(this.layer.id);
      this.map.removeSource(this.layer.id);
    }
  }
};
</script>