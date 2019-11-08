<template>
  <v-navigation-drawer clipped app permanent class="pa-2" width="350">
    <v-row dense>
      <v-col :cols="12">
        <v-card outlined>
          <v-card-title>Selections</v-card-title>
          <selections-list />
        </v-card>
      </v-col>
      <v-col :cols="12">
        <v-card outlined>
          <v-card-title>Configuration</v-card-title>

          <modeling-configuration />
        </v-card>
      </v-col>
    </v-row>
  </v-navigation-drawer>
</template>

<script>
import SelectionsList from './selections-list';
import ModelingConfiguration from './modeling-configuration';

export default {
  components: {
    SelectionsList,
    ModelingConfiguration
  }
};
</script>
