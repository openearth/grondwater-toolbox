<template>
  <div class="selection-configuration">
    <v-form v-model="valid">
      <v-row no-gutters>
        <v-col>
          <v-text-field
              v-model="formData.buffer"
              type="number"
              min="0"
              label="Grootte modelgebied (in m rondom de getekende polygoon)"
              :rules="[
              rules.requiredSizeModel,
              rules.minBufferSizeModel,
              rules.maxBuffer
            ]"
          />
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col>
          <v-text-field
              v-model="formData.drn_res"
              type="number"
              min="0"
              label="Geef drainage weerstand aan (in dagen)"
              :rules="[rules.requiredAmount, rules.minResAmount]"
          />
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col>
          <v-text-field
              v-model="formData.drn_bodh"
              type="number"
              min="0"
              label="Geef drainage bodemhoogte aan (in m-NAP)"
              :rules="[rules.requiredAmount]"
          />
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col>
          <v-select
              label="Horizontale rekenresolutie (meter)"
              v-model="formData.outres"
              :items="outres.map(res => ({ text: `${res}m`, value: res }))"
              :rules="[rules.required]"
          />
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col>
          <v-select
              label="Drainage toepassen in laag"
              v-model="formData.layer"
              :items="
                layers.map(layer => ({ text: `Laag ${layer}`, value: layer }))
              "
              :rules="[rules.required]"
          />
        </v-col>
      </v-row>
    </v-form>
  </div>
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
          buffer: '1000',
          layer: null,
          drn_res: 10,
          drn_bodh: 2.5,
          outres: 250,
        },
        layers: [ 1, 2, 3, 4, 5, 6, 7 ],
        outres: [ 25, 50, 125, 250 ],
        selectedColor: '#f79502',
        originalLineColor: '#000',
        bufferValid: true,
        drn_resValid: true,
        valid: false,
        rules: {
          required: (value) => !!value || 'Benodigd.',
          requiredSizeModel: value => !!value || 'Benodigd.',
          minBufferSizeModel: value =>
            value >= 500 || 'Een grootte van minimaal 500 meter is vereist.',
          requiredAmount: value => !!value || 'Benodigd.',
          minResAmount: value =>
            value > 0 || 'Een minimum van 1 dag is vereist.',
          maxBuffer: value =>
            parseFloat(value) <= 25000 ||
            'De grootte mag niet groter zijn dan 25.000 meter.',
        },
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
    beforeMount() {
      this.formData = this.value;
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
