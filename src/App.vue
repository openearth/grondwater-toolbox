<template>
  <v-app>
    <error-snackbar />

    <app-sidebar />

    <v-app-bar
      class="app-header"
      app
      color="primary"
      dark
    >
      <v-toolbar-title>
        <router-link
          :to="{ name: 'home' }"
          class="white--text text-decoration-none"
        >
          Grondwater Toolbox
        </router-link>
      </v-toolbar-title>
      <v-spacer />
      <load-button />
      <save-button />
      <reset-button />
      <v-menu bottom left>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            dark
            icon
            v-bind="attrs"
            v-on="on"
          >
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item :to="{ name: 'legal' }">
            <v-list-item-title>Legal</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-main>
      <app-map />
    </v-main>

    <welcome-dialog />
  </v-app>
</template>

<script>
  import AppSidebar from '@/components/app-sidebar';
  import ErrorSnackbar from '@/components/error-snackbar';
  import LoadButton from '@/components/load-button';
  import ResetButton from '@/components/reset-button';
  import SaveButton from '@/components/save-button';
  import WelcomeDialog from '@/components/welcome-dialog';

  export default {
    components: {
      AppMap: () => import('@/components/app-map'),
      AppSidebar,
      ErrorSnackbar,
      LoadButton,
      ResetButton,
      SaveButton,
      WelcomeDialog,
    },
  };
</script>

<style src="./components/app-core/index.css"></style>
