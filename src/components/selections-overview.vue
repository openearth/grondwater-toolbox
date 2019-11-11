<template>
  <div class="pa-4 fill-height d-flex flex-column">
    <h2>Selections</h2>
    <selections-list />

    <sidebar-footer>
      <v-btn 
        :disabled="!selections.length"
        slot="end"
        class="primary"
        :to="{ name: 'calculation' }"
      >Next</v-btn>
    </sidebar-footer>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
import SidebarFooter from './sidebar-footer';
import SelectionsList from './selections-list';

export default {
  components: {
    SelectionsList,
    SidebarFooter
  },
  computed: {
    ...mapState({
      selections: state => state.selections.selections
    })
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