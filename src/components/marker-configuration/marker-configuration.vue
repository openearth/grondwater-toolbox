<template>
  <div class="marker-configuration">
    <v-form v-model="valid">
      <v-row no-gutters>
        <v-col>
          <v-text-field
            type="number"
            label="Hoeveelheid onttrekking (m3 jaar)"
            v-model="subtraction"
            min="500"
            :rules="[rules.required]"
          />
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col>
          <v-text-field
            type="number"
            label="Grootte modelgebied (in m rondom locatie)"
            v-model="area"
            min="0"
            :rules="[rules.required, rules.notZero]"
          />
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col>
          <v-select
            label="Laag van berekening"
            v-model="selectedLayer"
            :items="layers.map((layer) => ({ text: `Laag ${layer}`, value: layer }))"
            :rules="[rules.required]"
          />
        </v-col>
      </v-row>
    </v-form>

    <div class="d-flex justify-space-between align-center">
      <v-alert
        v-if="loadingWmsLayers"
        class="mb-0 py-1"
        type="info"
        dense
        outlined
      >
        Let op! Dit kan even duren.
      </v-alert>
      <v-btn
        class="ml-auto"
        color="primary"
        :disabled="!valid || loadingWmsLayers"
        :loading="loadingWmsLayers"
        depressed
        @click="calculate"
      >
        Berekenen
      </v-btn>
    </div>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';

  export default {
    data() {
      return {
        area: 0,
        areaValid: true,
        layers: [ 1, 2, 3, 4, 5, 6, 7 ],
        selectedLayer: null,
        subtraction: 500,
        subtractionValid: true,
        rules: {
          required: (value) => !!value || 'Benodigd.',
          notZero: (value) => value !== '0' || 'Waarde mag niet 0 zijn.',
          minExtent: (value) =>
            value >= 500 || 'Een grootte van minimaal 500 meter is vereist.',
        },
        valid: false,
      };
    },
    created() {
      this.resetWmsLayers();

      if (!this.activeMarker) {
        this.$router.push({ name: 'tool-introduction' });
      }
    },
    updated() {
      if (this.wmsLayers.length) {
        this.removeLockedViewerStep({ step: 3 });
      } else {
        this.addLockedViewerStep({ step: 3 });
      }
    },
    computed: {
      ...mapGetters('mapbox', [ 'activeMarker', 'loadingWmsLayers', 'wmsLayers' ]),
      zoomLevel() {
        const area = parseInt(this.area, 10);
        // zoom level is based on the area size.
        switch (true) {
        case (area <= 1000):
          return 13;
        case (area <= 5000):
          return 12;
        case (area <= 10000):
          return 11;
        case (area <= 50000):
          return 10;
        default: {
          return 10;
        }
        }
      },
    },
    methods: {
      ...mapActions('app', [ 'addLockedViewerStep', 'removeLockedViewerStep' ]),
      ...mapActions('abstraction', [ 'calculateResult' ]),
      ...mapActions('mapbox', [ 'resetWmsLayers' ]),
      async calculate() {
        this.resetWmsLayers();
        const { lng, lat } = this.activeMarker._lngLat;

        const properties = {
          area: parseInt(this.area, 10),
          coordinates: [ lng, lat ],
          layer: parseInt(this.selectedLayer, 10),
          abstraction: parseInt(this.subtraction, 10),
        };

        await this.calculateResult(properties);
        this.zoomToSelection({ lng, lat });
      },
      zoomToSelection({ lng, lat }) {
        this.$root.map.flyTo({
          center: [ lng, lat ],
          zoom: this.zoomLevel,
        });
      },
    },
  };
</script>

<style src="./marker-configuration.css"></style>
