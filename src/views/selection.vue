<template>
  <div class="pa-4 selection d-flex flex-column">
    <h2 class="text-h4">Selecties</h2>
    <v-divider class="mt-4 mb-4" />

    <div class="selection__content">
      <selections-list />
    </div>

    <sidebar-footer>
      <v-btn
        slot="start"
        :to="{ name: 'tool-introduction' }"
        depressed
      >
        <v-icon>mdi-chevron-left</v-icon>
        Vorige
      </v-btn>
      <v-btn
        slot="end"
        class="primary"
        :disabled="selectionsLoading || !selections.length"
        :to="{ name: 'tool-calculation' }"
        depressed
      >
        Volgende
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </sidebar-footer>
  </div>
</template>

<script>
import { mapMutations, mapState, mapGetters } from 'vuex';

import SidebarFooter from '@/components/sidebar-footer';
import SelectionsList from '@/components/selections-list';

export default {
  components: {
    SelectionsList,
    SidebarFooter,
  },
  computed: {
    ...mapState({
      selections: state => state.selections.selections
    }),
    ...mapGetters({
      selectionsLoading: 'selections/loading'
    })
  },
  created() {
    this.resetWmsLayers();

    if (this.$root.map) {
      const { __draw } = this.$root.map;

      if (__draw) {
        __draw.changeMode('simple_select');
      }
    }
  },
  methods: {
    ...mapMutations('mapbox', ['resetWmsLayers']),
  }
};
</script>

<style>
  .selection {
    height: 100%;
    overflow: hidden;
  }

  .selection__content {
    overflow-y: auto;
    flex: 1;
  }
</style>
