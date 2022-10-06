<template>
  <v-app>
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

      <v-spacer />

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
          <v-list-item :to="{ name: 'about' }">
            <v-list-item-title>Over Grondwater Toolkit</v-list-item-title>
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
  import LoadButton from '@/components/load-button';
  import ResetButton from '@/components/reset-button';
  import SaveButton from '@/components/save-button';
  import WelcomeDialog from '@/components/welcome-dialog';

  export default {
    components: {
      AppMap: () => import('@/components/app-map'),
      AppSidebar,
      LoadButton,
      ResetButton,
      SaveButton,
      WelcomeDialog,
    },
  };
</script>

<style src="./components/app-core/index.css"></style>
