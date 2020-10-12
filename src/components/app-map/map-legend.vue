<template>
  <div class="map-legend">
    <img :src="imgUrl" />
  </div>
</template>

<script>
import legendUrl from '@/lib/legend-url';

export default {
  props: {
    url: {
      type: String,
      required: true
    },
    layer: {
      type: String,
      required: true
    }
  },
  computed: {
    imgUrl() {
      return legendUrl({
        url: this.url,
        layer: this.layer
      });
    }
  }
};
</script>

<style>
.map-legend {
  position: absolute;
  left: 10px;
  bottom: 30px;
  z-index: 100;
}
</style>
