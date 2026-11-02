<template>
  <raster-layer :layer="layer" :before="before" />
</template>

<script>
  import RasterLayer from '@/components/map-components/raster-layer';
  import { generateWmsLayer } from '@/lib/project-layers';

  export default {
    components: {
      RasterLayer,
    },
    props: {
      before: {
        type: String,
        required: false,
      },
    },
    data() {
      return {
        layer: generateWmsLayer({
          url: 'https://basisrivierbodemligging.openearth.nl/geoserver/wms',
          id: 'waterways-reference',
          layer: 'vaarwegvakken:bnd_l2_d_ln',
        }),
      };
    },
  };
</script>
