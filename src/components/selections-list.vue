<template>
  <p class="selections-list__empty-state text-body-1 py-4" v-if="!selections.length">
    <v-icon small>{{ icons.mdiVectorSquare }}</v-icon>
    <span>Selecteer waterwegen waar u uw berekeningen op wilt uitvoeren</span>
  </p>
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

      if (this.$root.map) {
        const { __draw } = this.$root.map;

        if (__draw) {
          __draw.changeMode('simple_select');
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
