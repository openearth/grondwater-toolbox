<template>
  <mgl-raster-layer
    ref="pathLayer"
    :source-id="`${layer.id}-source`"
    :layer-id="`${layer.id}-layer`"
    :layer="layer"
    v-bind="$attrs"
  />
  <!--     before="gl-draw-polygon-fill-inactive.cold" TODO: I removed this line. It was preventing the layers of the abstraction to show up. 
       see why it was there. -->
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
