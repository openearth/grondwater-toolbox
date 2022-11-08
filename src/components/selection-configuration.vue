<template>
  <div class="selection-configuration">
    <v-text-field
      v-model="extent"
      type="number"
      min="0"
      label="Grootte van het model (m)"
      :rules="[rules.required, rules.minExtent]"
      @update:error="setExtentValidity"
    />

    <configuration-card
      v-for="(selection, index) in selections"
      :key="selection.id"
      :id="selection.id"
      :title="selection.name"
      @mouseenter="handleMouseEnter(selection.id)"
      @mouseleave="handleMouseLeave(selection.id)"
    >
      <v-row no-gutters>
        <v-col cols="12" sm="5">
          <v-card
            class="pa-2"
            outlined
            tile
          >
            Maatregel
          </v-card>
        </v-col>
        <v-col cols="12" sm="3">
          <v-card
            class="pa-2"
            outlined
            tile
          >
            Verschil
          </v-card>
        </v-col>
        <v-col cols="12" sm="3">
          <v-card
            class="pa-2"
            outlined
            tile
          >
            Berekening
          </v-card>
        </v-col>
      </v-row>

      <configuration-form
        v-for="(form, index) in selection.configuration"
        v-model="form.data"
        :key="form.id"
        :id="form.id"
        :disabled="disabled"
        :deletable="index !== 0"
        @delete="handleDeleteForm(selection.id, $event)"
        @validated="setFormValidity(selection, $event)"
      />

      <v-btn
        icon-start
        class="mt-4"
        title="berekening toevoegen"
        depressed
        @click="addForm(selection.id)"
      >
        <v-icon left>mdi-plus</v-icon>
        Berekening
      </v-btn>

      <v-divider v-if="index !== selections.length - 1" class="mt-6" />
    </configuration-card>

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

    <v-alert
      v-if="wmsLayers.length"
      class="mt-5"
      dense
      outlined
      type="info"
    >
      Klik op een punt op de kaart om de waarde te zien.
    </v-alert>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';
  import bbox from '@turf/bbox';
  import { featureCollection } from '@turf/helpers';

  import ConfigurationCard from '@/components/configuration-card';
  import ConfigurationForm from '@/components/configuration-form';

  export default {
    components: {
      ConfigurationCard,
      ConfigurationForm,
    },
    props: {
      disabled: {
        type: Boolean,
        required: false,
      },
    },
    data() {
      return {
        extent: '1000',
        extentValid: true,
        selectedColor: '#f79502',
        originalLineColor: '#000',
        rules: {
          required: (value) => !!value || 'Benodigd.',
          minExtent: (value) =>
            value >= 500 || 'Een grootte van minimaal 500 meter is vereist.',
        },
      };
    },
    created() {
      this.resetWmsLayers();

      // TODO: wmsLayers is empty when the user navigates back to the selection page.
      if (this.wmsLayers.length) {
        this.removeLockedViewerStep({ step: 3 });
      } else {
        this.addLockedViewerStep({ step: 3 });
      }

      if (!this.selections.length) {
        this.$router.push({ name: 'tool-introduction' });
      }

      if (this.$root.map) {
        const { __draw } = this.$root.map;

        if (__draw) {
          __draw.changeMode('static');
        }

        this.zoomToSelection();
      }
    },
    computed: {
      ...mapGetters('mapbox', [ 'features', 'loadingWmsLayers', 'wmsLayers' ]),
      ...mapGetters('selections', [ 'selections' ]),
      // iterates through all forms and checks if every one of them is valid
      valid() {
        return (
          this.selections.every((selection) => {
            return selection.configuration.every((form) => form.valid);
          }) && this.extentValid
        );
      },
      // prepares form data to be sent to the 'calculate' action
      formattedForms() {
        return this.selections.reduce((acc, selection) => {
          const { configuration } = selection;
          const feature = this.features.find(feature => feature.id === selection.id);

          configuration.forEach((form) => {
            const { data } = form;

            const formattedData = {
              ...data,
              [data.measure]: data.difference,
            };

            delete formattedData.measure;
            delete formattedData.difference;

            acc.push({
              id: feature.watersIdentifier,
              extent: this.extent,
              ...formattedData,
            });
          });

          return acc;
        }, []);
      },
    },
    methods: {
      ...mapActions('app', [ 'addLockedViewerStep', 'removeLockedViewerStep' ]),
      ...mapActions('mapbox', [ 'calculateResult', 'resetHiddenWmsLayers', 'resetWmsLayers' ]),
      ...mapActions('selections', [ 'addSelectionConfiguration', 'removeSelectionConfiguration' ]),
      addForm(id) {
        this.addSelectionConfiguration({ id });
      },
      async calculate() {
        this.resetWmsLayers();
        this.resetHiddenWmsLayers();
        await this.calculateResult(this.formattedForms);

        if (this.valid) {
          this.removeLockedViewerStep({ step: 3 });
        } else {
          this.addLockedViewerStep({ step: 3 });
        }
      },
      handleMouseLeave(id) {
        this.$root.map.setPaintProperty(id, 'line-color', this.originalLineColor);
      },
      handleMouseEnter(id) {
        this.$root.map.setPaintProperty(id, 'line-color', this.selectedColor);
      },
      handleInput({ id, formId, data }) {
        const feature = this.forms.find({ id } === id);
        const form = feature && feature.forms.find(({ id }) => id === formId);

        form.data = data;
      },
      handleDeleteForm(selectionId, formId) {
        this.removeSelectionConfiguration({ selectionId, formId });
      },
      setFormValidity(selection, { id, valid }) {
        const form = selection.configuration.find((form => form.id === id));

        form.valid = valid;
      },
      setExtentValidity(hasError) {
        this.extentValid = !hasError;
      },
      zoomToSelection() {
        if (!this.features.length) {
          return;
        }

        const bounds = bbox(
          featureCollection(
            this.features.map((feature) => ({
              geometry: feature.source.data,
              type: 'Feature',
            }))
          )
        );

        this.$root.map.fitBounds(bounds, { padding: 50 });
      },
    },
  };
</script>

<style>
.selection-configuration {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
</style>
