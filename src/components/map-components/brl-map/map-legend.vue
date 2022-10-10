<template>
  <div class="map-legend">
    <p class="text-body-2">Legenda</p>
    <img
      :src="imgUrl"
      alt="Legend image"
    />
  </div>
</template>

<script>
  import legendUrl from '@/lib/legend-url';

  export default {
    props: {
      url: {
        type: String,
        required: true,
      },
      layer: {
        type: String,
        required: true,
      },
    },
    computed: {
      imgUrl() {
        return legendUrl({
          url: this.url,
          layer: this.layer,
        });
      },
    },
  };
</script>

<style>
.map-legend {
  display: flex;
  position: absolute;
  z-index: 100;
  bottom: 36px;
  left: 10px;
  flex-direction: column;
  padding: 16px;
  border-radius: 4px;
  background-color: #ffffff;
  box-shadow: 0 0 5px 2px rgba(0, 0, 0, .12);
}

.map-legend img {
  max-width: 165px;
  max-height: 450px;
}
</style>
