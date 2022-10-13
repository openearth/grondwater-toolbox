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
      <tool-maps />
    </v-main>

    <welcome-dialog />

    <toast-message :show="Boolean(toastMessage)" :message="toastMessage" />
  </v-app>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';

  import AppSidebar from '@/components/app-sidebar';
  import LoadButton from '@/components/load-button';
  import ResetButton from '@/components/reset-button';
  import SaveButton from '@/components/save-button';
  import WelcomeDialog from '@/components/welcome-dialog';
  import ToastMessage from '@/components/toast-message/toast-message';

  export default {
    components: {
      AppSidebar,
      LoadButton,
      ToolMaps: () => import('@/components/tool-maps/tool-maps'),
      ResetButton,
      SaveButton,
      WelcomeDialog,
      ToastMessage,
    },
    computed: {
      ...mapGetters('app', [ 'toastMessage' ]),
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
