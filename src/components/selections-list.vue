<template>
  <p class="ps-4" v-if="!selections.length">No selections found</p>
  <v-list class="pt-0" v-else>
    <v-list-item v-for="selection in selections" :key="selection.id">
      <v-list-item-content>
        <v-list-item-title>{{ selection.name }}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState({
      selections: state => state.selections.selections
    })
  }
};
</script>
