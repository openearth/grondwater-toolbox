<template>
  <div class="pa-4 d-flex flex-column">
    <h2>Configuratie</h2>

    <v-btn @click="calculate" color="primary">Bereken</v-btn>

    <sidebar-footer>
      <v-btn slot="start" class="primary" :to="{ name: 'selection' }">Vorige</v-btn>
    </sidebar-footer>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import SidebarFooter from '@/components/sidebar-footer';

export default {
  components: {
    SidebarFooter
  },
  computed: {
    ...mapState({
      selections: state => state.selections.selections
    })
  },
  created() {
    if (!this.selections.length) {
      this.$router.push({ name: 'selection' });
    }

    if (this.$root.map) {
      const { __draw } = this.$root.map;

      __draw.changeMode('static');
    }
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