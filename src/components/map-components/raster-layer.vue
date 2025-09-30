<template>
  <mgl-raster-layer
    ref="pathLayer"
    :source-id="`${layer.id}-source`"
    :layer-id="`${layer.id}-layer`"
    :before="before"	
    :layer="layer"
    v-bind="$attrs"
  />
</template>

<script>
  import { MglRasterLayer } from 'vue-mapbox';

  export default {
    inject: [ 'map' ],
    components: {
      MglRasterLayer,
    },
    props: {
      layer: {
        type: Object,
        required: true,
      },
      before: {
        type: String,
        required: false,
      },
    },
    methods: {
      removeLayer() {
        if (this.map.getLayer(this.layer.id)) {
          this.map.removeLayer(this.layer.id);
          this.map.removeSource(this.layer.id);
        }
      },
    },
    beforeMount() {
      this.removeLayer();
    },
    beforeDestroy() {
      this.removeLayer();
    },
  };
</script>
