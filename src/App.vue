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
        <v-btn
          v-if="isNotHome"
          color="primary"
          @click="onHomeClick"
        >
          Grondwater Toolbox
        </v-btn>
        <h1 v-else class="text-button">Grondwater Toolbox</h1>
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
            <v-list-item-title>Over de Grondwater Toolkit</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-main>
      <map-components />
    </v-main>

    <welcome-dialog />
  </v-app>
</template>

<script>
  import { mapActions } from 'vuex';

  import AppSidebar from '@/components/app-sidebar';
  import LoadButton from '@/components/load-button';
  import ResetButton from '@/components/reset-button';
  import SaveButton from '@/components/save-button';
  import WelcomeDialog from '@/components/welcome-dialog';

  export default {
    components: {
      AppSidebar,
      LoadButton,
      MapComponents: () => import('@/components/map-components'),
      ResetButton,
      SaveButton,
      WelcomeDialog,
    },
    computed: {
      isNotHome() {
        return this.$route.name !== 'home';
      },
    },
    methods: {
      ...mapActions('data', [ 'reset' ]),
      onHomeClick() {
        this.$router.push({ name: 'home' });
        this.reset();
      },
    },
  };
</script>

<style src="./components/app-core/index.css"></style>
