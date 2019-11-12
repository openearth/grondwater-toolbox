<template>
  <v-app>
    <app-sidebar />

    <v-app-bar class="app-header" app color="indigo" dark>
      <v-toolbar-title>BRL</v-toolbar-title>\
      <v-spacer />
      <reset-button />
    </v-app-bar>

    <v-content>
      <app-map />
    </v-content>

    <welcome-dialog />

  </v-app>
</template>

<script>
import AppMap from '@/components/app-map';
import AppSidebar from '@/components/app-sidebar';
import WelcomeDialog from '@/components/welcome-dialog';
import ResetButton from '@/components/reset-button';

export default {
  components: {
    AppMap,
    AppSidebar,
    WelcomeDialog,
    ResetButton
  }
};
</script>

<style src="./components/app-core/index.css"></style>
