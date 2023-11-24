<template>
    <v-alert
    v-if="!hasCoordinates"
    dense
    outlined
    type="info"
    >
        Selecteer een punt op de kaart waar u uw berekeningen op wilt uitvoeren.
    </v-alert>
  </template>
  
  <script>
  import { mapGetters } from 'vuex';
  
  export default {
    computed: {
      ...mapGetters('mapbox', [ 'activeMarker' ]),
      hasCoordinates() {
        return this.activeMarker && this.activeMarker._lngLat;
      },
    },
  };
  </script>
  
