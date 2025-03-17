<template>
  <v-form v-model="valid" class="configuration-form border">
    <v-row
        no-gutters
        v-for="level in Object.keys(formData)"
        :key="level"
        :class="formData[level].enabled ? 'active' : 'inactive'"
    >
      <v-col cols="12" sm="1">
        <v-card
            class="full-height d-flex align-center justify-center"
            outlined
            tile
        >
          <v-checkbox
              v-model="formData[level].enabled"
              hide-details
              class="hide-label checkbox align-center"
              label="Plaatsing"
              :disabled="disabled"
          />
        </v-card>
      </v-col>
      <v-col cols="12" sm="3">
        <v-card
            class=" full-height d-flex align-center"
            outlined
            tile
        >
          <span class="pl-2">
            {{ levels[level] }}
          </span>
        </v-card>
      </v-col>
      <v-col
          cols="12"
          sm="4"
      >
        <v-card
            class="pa-2 full-height d-flex"
            outlined
            tile
        >
          <v-select
              v-model="formData[level].measure"
              class="hide-label"
              label="Onttrekking toepassen in laag"
              :items="measures"
              :disabled="disabled"
          />
        </v-card>
      </v-col>
      <v-col
          cols="12"
          sm="2"
      >
        <text-field-measure
            v-model="formData[level].difference"
            :differenceRules="differenceRules"
            :disabled="disabled"
        />
      </v-col>
      <v-col
          cols="12"
          sm="2"
      >
        <v-card
            class="pa-2 full-height d-flex"
            outlined
            tile
        >
          <v-select
              v-model="formData[level].calculationLayer"
              class="hide-label"
              label="Onttrekking toepassen in laag"
              :items="calculationLayers.map((l) => ({ text: l, value: l }))"
              :disabled="disabled"
          />
        </v-card>
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
  import TextFieldMeasure from '@/components/text-field-measure';

  export default {
    components: {
      TextFieldMeasure,

    },
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
      type: {
        type: String,
        required: false,
        default: 'default',
      },
      deletable: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        formData: {
          default: {
            main: {
              enabled: true,
              difference: '1',
              calculationLayer: 1,
              measure: 'stageDiff',
            },
            primary: {
              enabled: false,
              difference: '1',
              calculationLayer: 1,
              measure: 'stageDiff',
            },
            secondary: {
              enabled: false,
              difference: '1',
              calculationLayer: 1,
              measure: 'stageDiff',
            },
            tertiary: {
              enabled: false,
              difference: '1',
              calculationLayer: 1,
              measure: 'stageDiff',
            },
          },
        },
        calculationLayers: [ 1, 2 ],
        levels: {
          main: 'Hoofd',
          primary: 'Primair',
          secondary: 'Secundair',
          tertiary: 'Tertiair',
        },
        measures: [
          {
            text: 'Rivierbodem (unit m)',
            value: 'stageDiff',
          },
          {
            text: 'Weerstand (unit m/d)',
            value: 'condDiff',
          },
          {
            text: 'Waterpeil (unit m)',
            value: 'rbotDiff',
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
            (value) =>
              (value >= -10 && value <= 10) ||
              'Waarde moet tussen -10 en 10 meter vallen.',
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

        return [];
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
  };
</script>

<style>
.inactive * {
  color: rgba(0, 0, 0, 0.4) !important;
  fill: rgba(0, 0, 0, 0.4) !important;
}
.checkbox {
  aspect-ratio: 1/1;
}

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
