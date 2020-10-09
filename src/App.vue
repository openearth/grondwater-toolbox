<template>
  <v-app>
    <error-snackbar />

    <app-sidebar />

    <v-app-bar class="app-header" app color="primary" dark>
      <v-toolbar-title>
        <router-link
          :to="{ name: 'introduction' }"
          class="white--text text-decoration-none"
        >
          BRL
        </router-link>
      </v-toolbar-title>
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
import AppSidebar from '@/components/app-sidebar';
import WelcomeDialog from '@/components/welcome-dialog';
import ResetButton from '@/components/reset-button';
import ErrorSnackbar from '@/components/error-snackbar';

export default {
  components: {
    AppMap: () => import('@/components/app-map'),
    AppSidebar,
    ResetButton,
    WelcomeDialog,
    ErrorSnackbar
  }
};
</script>

<style src="./components/app-core/index.css"></style>
