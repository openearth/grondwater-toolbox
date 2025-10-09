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
      <v-col cols="12" sm="4">
        <v-card
      class="pa-2 full-height d-flex"
      outlined
      tile>
          <v-menu
            v-model="formData[level].menu"
            :close-on-content-click="true"
            offset-y
            :disabled="disabled"
          >
            <template v-slot:activator="{ on: menuOn, attrs: menuAttrs }">
              <v-tooltip bottom>
                <template v-slot:activator="{ on: tooltipOn, attrs: tooltipAttrs }">
                  <v-text-field
                    class="hide-label"
                    v-bind="{ ...menuAttrs, ...tooltipAttrs }"
                    v-on="{ ...menuOn, ...tooltipOn }"
                    :value="getMeasureText(formData[level].measure)"
                    label="Onttrekking toepassen in laag"
                    readonly
                    append-icon="mdi-menu-down"
                    :disabled="disabled"
                  />
                </template>
                <span>{{ showTooltip(formData[level].measure, level) }}</span>
              </v-tooltip>
            </template>

            <v-list dense>
              <v-list-item-group
                v-model="formData[level].measure"
                color="primary"
              >
                <v-tooltip
                  v-for="(item, i) in measures"
                  :key="i"
                  right
                >
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
            :differenceRules="getDifferenceRules(level, formData[level].measure)"
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
  import { initialFormData, calculationLayers, levels, measures, formDataInfo } from '@/data/brl-info';
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
        formData: JSON.parse(JSON.stringify(initialFormData)),
        calculationLayers,
        levels,
        measures,
        valid: false,
        formDataInfo,
      };
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
          this.formDataInfo &&
          this.formDataInfo[level] &&
          this.formDataInfo[level][measure]
        ) {
          return this.formDataInfo[level][measure]['tooltipMessage'];
        }
        return 'Geen informatie beschikbaar';
      },

      getDifferenceRules(level, measure) {
        const info = this.formDataInfo[level][measure];
        const [ min, max ] = info.ranges;
        return [
          (value) => !!value || 'Benodigd.',
          (value) =>
            (parseFloat(value) >= min && parseFloat(value) <= max) ||
            `Waarde moet tussen ${ min } en ${ max } meter vallen.`,
        ];
      },      

    },
    beforeMount() {
      this.formData = this.value;
      this.rules = this.getDifferenceRules('main', 'stageDiff');
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
