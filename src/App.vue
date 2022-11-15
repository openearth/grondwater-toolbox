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

      <step-actions />

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
  import StepActions from '@/components/step-actions/step-actions';
  import ToastMessage from '@/components/toast-message/toast-message';
  import WelcomeDialog from '@/components/welcome-dialog';

  export default {
    components: {
      AppSidebar,
      StepActions,
      ToastMessage,
      ToolMaps: () => import('@/components/tool-maps/tool-maps'),
      WelcomeDialog,
    },
    computed: {
      ...mapGetters('app', [ 'toastMessage' ]),
      isNotHome() {
        return this.$route.name !== 'home';
      },
    },
    methods: {
      ...mapActions('abstraction', { abstractionReset: 'reset' }),
      ...mapActions('app', { appReset: 'reset' }),
      ...mapActions('mapbox', { mapboxReset: 'reset' }),
      ...mapActions('selections', { selectionsReset: 'reset' }),
      onHomeClick() {
        this.$router.push({ name: 'home' });

        this.abstractionReset();
        this.appReset();
        this.mapboxReset();
        this.selectionsReset();
      },
    },
  };
</script>

<style src="./components/app-core/index.css"></style>
