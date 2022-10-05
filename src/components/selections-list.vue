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
  import { mapGetters } from 'vuex';
  import { mdiVectorSquare } from '@mdi/js';

  import SelectionsListItem from './selections-list-item';

  export default {
    components: { SelectionsListItem },
    data() {
      return {
        icons: {
          mdiVectorSquare,
        },
      };
    },
    computed: {
      ...mapGetters('selections', [ 'selections' ]),
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
