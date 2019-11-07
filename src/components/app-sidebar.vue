<template>
  <v-navigation-drawer app permanent>
    <h2 class="title">Selections:</h2>
    <v-list>
      <v-list-item v-for="selection in selections" :key="selection.id">
        <v-list-item-content>
          <v-list-item-title>{{ selection.name }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
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

<style>
</style>