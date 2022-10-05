<template>
  <div class="pa-4 d-flex flex-column">
    <h2 class="text-h4">Introduction</h2>
    <v-divider class="mt-4 mb-4" />

    <div class="text-body-1" v-html="viewerIntroduction" />

    <sidebar-footer>
      <v-btn
        slot="end"
        color="primary"
        class="ml-auto"
        :to="{ name: 'tool-step-1' }"
        depressed
      >
        Volgende
        <v-icon right>mdi-chevron-right</v-icon>
      </v-btn>
    </sidebar-footer>
  </div>
</template>

<script>
  import { mapState } from 'vuex';

  import SidebarFooter from '@/components/sidebar-footer';

  export default {
    components: { SidebarFooter },
    computed: {
      ...mapState('app', [ 'viewerIntroduction' ]),
    },
  };
</script>
