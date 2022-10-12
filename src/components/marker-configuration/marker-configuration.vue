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
            :items="layers.map((layer) => ({ text: `Layer ${layer}`, value: layer }))"
            :rules="[rules.required]"
          />
        </v-col>
      </v-row>
    </v-form>

    <div class="d-flex justify-end">
      <v-btn
        @click="calculate"
        color="primary"
        :disabled="!valid || loadingWmsLayers"
        :loading="loadingWmsLayers"
        depressed
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
      if (!this.activeMarker) {
        this.$router.push({ name: 'tool-introduction' });
      }
    },
    computed: {
      ...mapGetters('mapbox', [ 'activeMarker', 'loadingWmsLayers', 'wmsLayers' ]),
    },
    methods: {
      ...mapActions('abstraction', [ 'calculateResult' ]),
      async calculate() {
        const { lng, lat } = this.activeMarker._lngLat;

        const properties = {
          area: parseInt(this.area, 10),
          coordinates: [ lng, lat ],
          layer: parseInt(this.selectedLayer, 10),
          abstraction: parseInt(this.subtraction, 10),
        };

        this.calculateResult(properties);
      },
    },
  };
</script>

<style src="./marker-configuration.css"></style>
