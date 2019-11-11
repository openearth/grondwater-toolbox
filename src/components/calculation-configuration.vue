<template>
  <div class="pa-4 fill-height d-flex flex-column">
    <h2>Configuration</h2>

    <v-btn @click="calculate" color="primary">Calculate</v-btn>

    <sidebar-footer>
      <v-btn slot="start" class="primary" :to="{ name: 'selection' }">Previous</v-btn>
    </sidebar-footer>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import SidebarFooter from './sidebar-footer';

export default {
  components: {
    SidebarFooter
  },
  methods: {
    ...mapActions('mapbox', ['calculateResult']),
    calculate() {
      this.calculateResult();
    }
  }
};
</script>

<style>
</style>