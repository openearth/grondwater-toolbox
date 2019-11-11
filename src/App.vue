<template>
  <v-app>
    <app-sidebar />

    <v-app-bar class="app-header" app color="indigo" dark>
      <v-toolbar-title>BR1L</v-toolbar-title>
    </v-app-bar>

    <v-content>
      <app-map />
    </v-content>
  </v-app>
</template>

<script>
import AppMap from '@/components/app-map';
import AppSidebar from '@/components/app-sidebar';

export default {
  components: {
    AppMap,
    AppSidebar
  }
};
</script>

<style>
.app-header {
  left: 0 !important;
}
</style>
