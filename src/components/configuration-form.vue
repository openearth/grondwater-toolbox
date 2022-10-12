<template>
  <v-form v-model="valid" class="configuration-form border">
    <v-row no-gutters>
      <v-col cols="12" sm="6">
        <v-card
          class="pa-2 full-height d-flex"
          outlined
          tile
        >
          <v-select
            v-model="formData.measure"
            class="hide-label"
            label="Laag van berekening"
            :items="measures"
            :disabled="disabled"
          />
        </v-card>
      </v-col>
      <v-col cols="12" sm="3">
        <v-card
          class="pa-2 full-height d-flex"
          outlined
          tile
        >
          <v-text-field
            v-model="formData.difference"
            class="hide-label"
            type="number"
            label="Verschil in rivierbodemhoogte (m)"
            :rules="differenceRules"
            :disabled="disabled"
          />
        </v-card>
      </v-col>
      <v-col cols="12" sm="3">
        <v-card
          class="pa-2 full-height d-flex"
          outlined
          tile
        >
          <v-select
            v-model="formData.calculationLayer"
            class="hide-label"
            label="Laag van berekening"
            :items="calculationLayers.map((l) => ({ text: `Layer ${l}`, value: l }))"
            :disabled="disabled"
          />
        </v-card>
      </v-col>
      <v-col cols="12" sm="1">
        <div
          v-if="deletable"
          class="d-flex justify-end align-center full-height"
        >
          <v-btn
            icon
            @click="handleDelete"
            title="delete form"
          >
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
  export default {
    props: {
      id: {
        type: String,
        required: true,
      },
      disabled: {
        type: Boolean,
        default: false,
      },
      value: {
        type: Object,
        required: true,
      },
      deletable: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        formData: {
          difference: '1',
          calculationLayer: 1,
          measure: 'riverbedDifference',
        },
        calculationLayers: [ 1, 2 ],
        measures: [
          {
            text: 'Rivierbodem (unit m)',
            value: 'riverbedDifference',
          },
          {
            text: 'Weerstand (unit m/d)',
            value: 'conductance',
          },
          {
            text: 'Waterpeil (unit m)',
            value: 'stageDifference',
          },
        ],
        rules: {
          required: (value) => !!value || 'Benodigd.',
          notZero: (value) => value !== '0' || 'Waarde mag niet 0 zijn.',
          minMaxDifference: (value) =>
            (value >= -10 && value <= 10) ||
            'Waarde moet tussen -10 en 10 meter vallen.',
        },
        valid: false,
      };
    },
    computed: {
      differenceRules() {
        if (this.formData.measure === 'riverbedDifference') {
          return [
            this.rules.required,
            this.rules.notZero,
            this.rules.minMaxDifference,
          ];
        }

        if (this.formData.measure === 'stageDifference') {
          return [
            this.rules.required,
            this.rules.notZero,
            (value) =>
              (value >= -20 && value <= 20) ||
              'Waarde moet tussen -20 en 20 meter vallen.',
          ];
        }

        return null;
      },
    },
    watch: {
      formData() {
        this.$emit('input', this.formData);
      },
      valid() {
        this.$emit('validated', { id: this.id, valid: this.valid });
      },
    },
    beforeMount() {
      this.formData = this.value;
    },
    methods: {
      handleDelete() {
        this.$emit('delete', this.id);
      },
    },
  };
</script>

<style>
.hide-label {
  padding-top: 0;
  margin-top: 0;
}

.hide-label label {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}

.hide-label .v-text-field__details,
.hide-label .v-text-field__details .v-messages {
  min-height: 0;
}
</style>
