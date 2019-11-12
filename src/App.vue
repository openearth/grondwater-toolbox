<template>
  <v-app>
    <app-sidebar />

    <v-app-bar class="app-header" app color="primary" dark>
      <v-toolbar-title>BRL</v-toolbar-title>
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

export default {
  components: {
    AppMap,
    AppSidebar,
    WelcomeDialog
  }
};
</script>

<style src="./components/app-core/index.css"></style>
