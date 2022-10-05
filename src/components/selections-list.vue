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
  import { mapState } from 'vuex';
  import SelectionsListItem from './selections-list-item';
  import { mdiVectorSquare } from '@mdi/js';

  export default {
    data() {
      return {
        icons: {
          mdiVectorSquare,
        },
      };
    },
    components: {
      SelectionsListItem,
    },
    computed: {
      ...mapState({
        selections: state => state.selections.selections,
      }),
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
