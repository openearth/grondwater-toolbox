<template>
  <div class="map-raster-opacity-control">
    <label class="map-raster-opacity-control__label" for="opacity">Opacity: {{ value }}%</label>
    <input
      class="map-raster-opacity-control__input"
      id="opacity"
      type="range"
      min="0"
      max="100"
      v-model="value"
    />
  </div>
</template>

<script>
  export default {
    name: 'map-raster-opacity-control',
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
        value: '100',
      };
    },
    watch: {
      value() {
        this.setLayersOpacity();
      },
      layers() {
        this.setLayersOpacity();
      },
    },
    methods: {
      setLayersOpacity() {
        this.layers.map(({ id }) => {
          this.map.setPaintProperty(
            id,
            'raster-opacity',
            parseInt(this.value, 10) / 100
          );
        });
      },
    },
  };
</script>

<style>
.map-raster-opacity-control {
  background: white;
  border-radius: 4px;
  padding: 1rem;
  position: absolute;
  left: 7rem;
  bottom: 2.25rem;
}

.map-raster-opacity-control__label {
  display: flex;
  margin-bottom: 0.25rem;
}
</style>
