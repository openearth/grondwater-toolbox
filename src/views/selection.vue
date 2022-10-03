<template>
  <div class="pa-4 d-flex flex-column">
    <h2>Selecties</h2>
    <selections-list />

    <sidebar-footer>
      <v-btn
        slot="end"
        :disabled="selectionsLoading || !selections.length"
        :to="{ name: 'calculation' }"
        class="primary"
      >
        Volgende
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
        selections: state => state.selections.selections,
      }),
      ...mapGetters({
        selectionsLoading: 'selections/loading',
      }),
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
      ...mapMutations('mapbox', [ 'resetWmsLayers' ]),
    },
  };
</script>
