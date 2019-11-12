<template>
  <p class="selections-list__empty-state py-4" v-if="!selections.length">
    <v-icon small class="selections-list__icon">{{ icons.mdiVectorSquare }}</v-icon> Selecteer waterwegen waar u uw berekeningen op wilt uitvoeren
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
        mdiVectorSquare
      },
    };
  },
  components: {
    SelectionsListItem
  },
  computed: {
    ...mapState({
      selections: state => state.selections.selections
    })
  }
};
</script>

<style>
.selections-list__empty-state {
  vertical-align: baseline;
}

.selections-list__icon {
  margin-top: -4px;
}
</style>