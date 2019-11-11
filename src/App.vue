<template>
  <v-app>
    <error-snackbar />

    <app-sidebar />

    <v-app-bar class="app-header" app color="indigo" dark>
      <v-toolbar-title>BRL</v-toolbar-title>
    </v-app-bar>

    <v-content>
      <app-map />
    </v-content>
  </v-app>
</template>

<script>
import AppMap from '@/components/app-map';
import AppSidebar from '@/components/app-sidebar';
import ErrorSnackbar from '@/components/error-snackbar';

export default {
  components: {
    AppMap,
    AppSidebar,
    ErrorSnackbar
  }
};
</script>

<style src="./components/app-core/index.css"></style>
