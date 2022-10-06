<template>
  <v-alert
    v-if="!selections.length"
    dense
    outlined
    type="info"
  >
    Selecteer waterwegen op de kaart waar u uw berekeningen op wilt uitvoeren.
  </v-alert>
  <v-list v-else>
    <selections-list-item
      v-for="selection in selections"
      :key="selection.id"
      :selection="selection"
    />
  </v-list>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';
  import { mdiVectorSquare } from '@mdi/js';

  import SelectionsListItem from '@/components/selections-list-item';

  export default {
    components: { SelectionsListItem },
    data() {
      return {
        icons: {
          mdiVectorSquare,
        },
      };
    },
    created() {
      this.resetWmsLayers();
    },
    beforeDestroy() {
      if (this.$root.map) {
        const { __draw } = this.$root.map;

        if (__draw) {
          __draw.changeMode('static');
        }
      }
    },
    updated() {
      if (this.selections.length) {
        this.removeLockedViewerStep({ step: 2 });
      } else {
        this.addLockedViewerStep({ step: 2 });
      }
    },
    computed: {
      ...mapGetters('selections', [ 'selections' ]),
    },
    methods: {
      ...mapActions('app', [ 'addLockedViewerStep', 'removeLockedViewerStep' ]),
      ...mapActions('mapbox', [ 'resetWmsLayers' ]),
    },
  };
</script>

<style>
  .selections-list__empty-state {
    display: flex;
    align-items: center;
    gap: 4px;
  }
</style>
