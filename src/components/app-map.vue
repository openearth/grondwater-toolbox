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
      <draw-control position="top-left" @create="onSelection" @update="onUpdateSelection" />
      <v-mapbox-navigation-control position="bottom-right" />
    </v-mapbox>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
import DrawControl from './draw-control';

export default {
  components: {
    DrawControl
  },
  methods: {
    ...mapMutations('selections', {
      addSelection: 'add',
      updateSelection: 'update'
    }),
    onSelection(event) {
      this.addSelection(event.features[0]);
    },
    onUpdateSelection(event) {
      this.updateSelection(event.features[0]);
    }
  }
};
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