<template>
  <v-form v-model="valid" class="configuration-form border">
    <v-row no-gutters>
      <v-col cols="12" sm="3">
        <v-card
            class=" full-height d-flex align-center"
            outlined
            tile
        >
          <span class="pl-2" v-if="type === 'system'">
            {{ levelLabel }}
          </span>
          <v-select
              v-else
              v-model="formData.level"
              class="hide-label pa-2"
              label="Niveau"
              :items="levels"
              :disabled="disabled"
          />

        </v-card>
      </v-col>
      <v-col
          v-if="type === 'default'"
          cols="12"
          sm="4"
      >
        <v-card
            class="pa-2 full-height d-flex"
            outlined
            tile
        >
          <v-select
              v-model="formData.measure"
              class="hide-label"
              label="Onttrekking toepassen in laag"
              :items="measures"
              :disabled="disabled"
          />
        </v-card>
      </v-col>
      <v-col
          v-if="type === 'default'"
          cols="12"
          sm="2"
      >
        <text-field-measure
            :key="formData.measure"
            :differenceRules="differenceRules"
            :disabled="disabled"
            @update-difference-value="onUpdateDifferenceValue" />
      </v-col>
      <v-col
          v-if="type === 'default'"
          cols="12"
          sm="2"
      >
        <v-card
            class="pa-2 full-height d-flex"
            outlined
            tile
        >
          <v-select
              v-model="formData.calculationLayer"
              class="hide-label"
              label="Onttrekking toepassen in laag"
              :items="calculationLayers.map((l) => ({ text: l, value: l }))"
              :disabled="disabled"
          />
        </v-card>
      </v-col>
      <v-col
          v-if="type === 'system'"
          cols="12"
          sm="5"
      >
        <v-card
            class="d-flex align-center pl-2"
            outlined
            tile
        >
          <v-checkbox
              v-model="formData.placement"
              :label="formData.placement ? 'Actief' : 'Activeren'"
              :items="placements"
              :disabled="disabled"
          />
        </v-card>
      </v-col>
      <v-col
          cols="12"
          sm="1"
          v-if="type !== 'system'"
      >
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
            difference: '1',
            calculationLayer: 1,
            measure: 'riverbedDifference',
            level: 0,
          },
          system: {
            level: 0,
            placement: false,
          },
        },
        calculationLayers: [ 1, 2 ],
        levels: [
          { text: 'Hoofd', value: 0 },
          { text: 'Primair', value: 1 },
          { text: 'Secundair', value: 2 },
          { text: 'Tertiair', value: 3 },
        ],
        placements: [
          {
            text: 0,
            value: 0,
          },
          {
            text: 1,
            value: 1,
          },
          {
            text: 2,
            value: 2,
          },
        ],
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
      levelLabel() {
        return this.levels.find((l) => l.value === this.formData.level).text;
      },
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
      onUpdateDifferenceValue(event) {
        this.formData.difference = event;
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
