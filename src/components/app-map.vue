<template>
  <div class="app-map">
    <v-mapbox
      class="app-map__map"
      access-token="pk.eyJ1Ijoic2lnZ3lmIiwiYSI6ImNqbHcwcHFjNjBsdGIza3F1dW5iZjhhY2EifQ.zZkkozZlSRtmB9VgpR9HiQ"
      map-style="mapbox://styles/mapbox/streets-v11"
      :center="[5.2913, 52.1326]"
      :zoom="6.5"
      id="map"
      ref="map"
    >
    </v-mapbox>
  </div>
</template>

<script>
export default {
  
}
</script>

<style>
.app-map {
  height: 100%;
  width: 100%;
}

.app-map__map {
  height: 100%;
  width: 100%;
}
</style>