<template>
  <div class="map-raster-opacity-control">
    <label class="map-raster-opacity-control__label text-body-2" for="opacity">
      Transparantie: {{ value }}%
    </label>
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
  display: flex;
  position: absolute;
  z-index: 100;
  bottom: 36px;
  left: 10px;
  flex-direction: column;
  width: 200px;
  padding: 16px;
  border-radius: 4px;
  background-color: #ffffff;
  box-shadow: 0 0 5px 2px rgba(0, 0, 0, .12);
}

.map-legend + .map-raster-opacity-control {
  left: 220px;
}

.map-raster-opacity-control__label {
  display: flex;
  margin-bottom: 0.25rem;
}
</style>
