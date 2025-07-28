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
       <v-menu
          v-model="formData[level].menu"
          :close-on-content-click="true"
          offset-y
          :disabled="disabled"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              class="hide-label"
              v-bind="attrs"
              v-on="on"
              :value="getMeasureText(formData[level].measure)"
              label="Onttrekking toepassen in laag"
              readonly
              append-icon="mdi-menu-down"
              :disabled="disabled"
            />
          </template>

          <v-list dense>
            <v-list-item-group
              v-model="formData[level].measure"
              color="primary"
            >
              <template v-for="(item, i) in measures">
                <v-tooltip right :key="i">
                  <template v-slot:activator="{ on, attrs }">
                    <v-list-item
                      v-bind="attrs"
                      v-on="on"
                      :value="item.value"
                      @click="selectMeasure(level, item.value)"
                    >
                      <v-list-item-content>
                        <v-list-item-title>{{ item.text }}</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </template>
                  <span>{{ showTooltip(item.value, level) }}</span>
                </v-tooltip>
              </template>
            </v-list-item-group>
          </v-list>
        </v-menu>

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
              menu: false,
            },
            primary: {
              enabled: false,
              difference: '1',
              calculationLayer: 1,
              measure: 'stageDiff',
              menu: false,
            },
            secondary: {
              enabled: false,
              difference: '1',
              calculationLayer: 1,
              measure: 'stageDiff',
              menu: false,
            },
            tertiary: {
              enabled: false,
              difference: '1',
              calculationLayer: 1,
              measure: 'stageDiff',
              menu: false,
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
        tooltipMessages: {
          main: {
            stageDiff: 'Verandering in bodemhoogte van het hoofd watersysteem. Mogelijk range: (-5 m , 5 m)',
            condDiff: 'Verandering in weerstand van het hoofd watersysteem. Mogelijk range: (-100 d , 100 d). NB, verandering in weerstand wordt omgerekend naar conductance met het totale celoppervlakte.',
            rbotDiff: 'Verandering in waterhoogte van het hoofd watersysteem. Mogelijk range: (-5 m , 5 m)',
          },
          primary: {
            stageDiff: 'Verandering in bodemhoogte van het primaire watersysteem. Mogelijk range: (-1 m , 1 m)',
            condDiff: 'Verandering in weerstand van het primaire watersysteem. Mogelijk range: (-10 d , 10 d). NB, verandering in weerstand wordt omgerekend naar conductance met het totale celoppervlakte.',
            rbotDiff: 'Verandering in waterhoogte van het primaire watersysteem. Mogelijk range: (-1 m , 1 m)',
          },
          secondary: {
            stageDiff: 'Verandering in bodemhoogte van het secundaire watersysteem. Mogelijk range: (-1 m , 1 m)',
            condDiff: 'Verandering in weerstand van het secundaire watersysteem. Mogelijk range: (-1 d , 1 d). NB, verandering in weerstand wordt omgerekend naar conductance met het totale celoppervlakte.',
            rbotDiff: 'Verandering in waterhoogte van het secundaire watersysteem. Mogelijk range: (-1 m , 1 m)',
          },
          tertiary: {
            stageDiff: 'Verandering in bodemhoogte van het tertiaire watersysteem. Mogelijk range: (-0.5 m , 0.5 m)',
            condDiff: 'Verandering in weerstand van het tertiare watersysteem. Mogelijk range: (-1 d , 1 d). NB, verandering in weerstand wordt omgerekend naar conductance met het totale celoppervlakte.',
            rbotDiff: 'Verandering in waterhoogte van het tertiare watersysteem. Mogelijk range: (-0.5 m , 0.5 m)',
          },
        },

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
    methods: {

      selectMeasure(level, value) {
        this.formData[level].measure = value;
        this.formData[level].menu = false;
      },
      getMeasureText(value) {
        const found = this.measures.find(m => m.value === value);
        return found ? found.text : '';
      },
      showTooltip(measure, level) {
        if (
          this.tooltipMessages &&
          this.tooltipMessages[level] &&
          this.tooltipMessages[level][measure]
        ) {
          return this.tooltipMessages[level][measure];
        }
        return 'Geen informatie beschikbaar';
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
