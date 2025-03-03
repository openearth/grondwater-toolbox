<template>
  <div class="marker-configuration">
    <v-form v-model="valid">
      <v-row no-gutters>
        <v-col>
          <v-text-field
            type="number"
            label="Hoeveelheid onttrekking (m³/dag)"
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
            :rules="[rules.required, rules.notZero, rules.maxExtent]"
          />
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col>
          <v-select
              label="Horizontale rekenresolutie"
              v-model="selectedOutres"
              :items="outres.map((res) => ({ text: `${res}m`, value: res }))"
              :rules="[rules.required]"
          />
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col>
          <v-select
            label="Onttrekking toepassen in laag"
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
        outres: [ 25, 50, 125, 250 ],
        selectedOutres: 250,
        selectedLayer: null,
        subtraction: 500,
        subtractionValid: true,
        rules: {
          required: (value) => !!value || 'Benodigd.',
          notZero: (value) => value !== '0' || 'Waarde mag niet 0 zijn.',
          minExtent: (value) =>
            parseFloat(value) >= 500 || 'Een grootte van minimaal 500 meter is vereist.',
          maxExtent: (value) => 
            parseFloat(value) <= 25000 || 'De grootte mag niet groter zijn dan 25.000 meter.',
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
      ...mapActions('app', [ 'addLockedViewerStep', 'removeLockedViewerStep', 'setViewerCurrentStepNumber' ]),
      ...mapActions('abstraction', [ 'calculateResult' ]),
      ...mapActions('mapbox', [ 'resetWmsLayers' ]),
      async onNext() {
        this.$router.push({ name: 'tool-step-3' });
        this.setViewerCurrentStepNumber({ step: 3 });
      },
      async calculate() {
        this.resetWmsLayers();
        const { lng, lat } = this.activeMarker._lngLat;

        const properties = {
          area: parseInt(this.area, 10),
          coordinates: [ lng, lat ],
          outres: parseInt(this.selectedOutres, 10),
          layer: parseInt(this.selectedLayer, 10),
          abstraction: parseInt(this.subtraction, 10),
        };

        await this.calculateResult(properties);
        this.zoomToSelection({ lng, lat });
        
        setTimeout(() => {
          this.onNext();
        }, 0);
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
