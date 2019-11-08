<template>
  <v-app>
    <app-sidebar />

    <v-app-bar class="app-header" app color="indigo" dark>
      <v-toolbar-title>BRL</v-toolbar-title>
    </v-app-bar>

    <v-content>
      <app-map ref="map-wrapper" />
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
  },
  mounted() {
    // const w = this.$refs['map-wrapper'];
  }
};
</script>

<style>
.app-header {
  left: 0 !important;
}
</style>
