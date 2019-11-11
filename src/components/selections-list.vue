<template>
  <p class="ps-4" v-if="!selections.length">No selections found</p>
  <v-list class="pt-0" v-else>
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

export default {
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