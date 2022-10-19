<template>
  <div class="marker-list">
    <v-list v-if="hasCoordinates">
      <v-list-item class="px-0">
        <v-list-item-icon>
          <v-icon>mdi-map-marker</v-icon>
        </v-list-item-icon>
        <v-list-item-content class="pa-0">
          <v-list-item-title>
            Geplaatste speld
          </v-list-item-title>
          <v-list-item-subtitle>Lng: {{ longitude }} - Lat: {{ latitute }}</v-list-item-subtitle>
        </v-list-item-content>
        <v-btn
          text
          icon
          title="Delete marker"
          @click="onDelete"
        >
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </v-list-item>
    </v-list>
    <v-alert
      v-else
      dense
      outlined
      type="info"
    >
      Selecteer een punt op de kaart waar u uw berekeningen op wilt uitvoeren.
    </v-alert>
    <v-divider v-if="hasCoordinates" class="my-6" />
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';

  export default {
    computed: {
      ...mapGetters('mapbox', [ 'activeMarker' ]),
      hasCoordinates() {
        return this.activeMarker && this.activeMarker._lngLat;
      },
      latitute() {
        return this.hasCoordinates && this.activeMarker._lngLat.lat;
      },
      longitude() {
        return this.hasCoordinates && this.activeMarker._lngLat.lng;
      },
    },
    methods: {
      ...mapActions('abstraction', [ 'removeProfile' ]),
      ...mapActions('app', [ 'addLockedViewerStep' ]),
      ...mapActions('mapbox', [ 'resetWmsLayers', 'setActiveMarker' ]),
      onDelete() {
        this.removeProfile();
        this.resetWmsLayers();
        this.setActiveMarker({ marker: null });
        this.addLockedViewerStep({ step: 2 });

        if (this.$route.name !== 'tool-step-1') {
          this.$router.push({ name: 'tool-step-1' });
        }
      },
    },
  };
</script>
