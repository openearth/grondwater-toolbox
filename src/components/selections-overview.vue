<template>
  <div class="pa-4 fill-height d-flex flex-column">
    <h2>Selections</h2>
    <selections-list />

    <sidebar-footer>
      <v-btn slot="end" class="primary" :to="{ name: 'calculation' }">Next</v-btn>
    </sidebar-footer>
  </div>
</template>

<script>
import SidebarFooter from './sidebar-footer';
import SelectionsList from './selections-list';
import { mapMutations } from 'vuex';

export default {
  components: {
    SelectionsList,
    SidebarFooter
  },
  created() {
    this.resetWmsLayers();

    if (this.$root.map) {
      const { __draw } = this.$root.map;

      __draw.changeMode('simple_select');
    }
  },
  methods: {
    ...mapMutations('mapbox', ['resetWmsLayers'])
  }
};
</script>