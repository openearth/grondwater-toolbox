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

          <v-card-actions>
            <v-btn @click="calculate" color="primary">Calculate</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-navigation-drawer>
</template>

<script>
import SelectionsList from './selections-list';
import { mapActions } from 'vuex';

export default {
  components: {
    SelectionsList
  },
  methods: {
    ...mapActions('mapbox', ['calculateResult']),
    calculate() {
      this.calculateResult();
    }
  }
};
</script>
