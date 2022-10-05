<template>
  <div class="pa-4 d-flex flex-column">
    <h2 class="text-h4">{{ stepTitle }}</h2>
    <v-divider class="mt-4 mb-4" />

    <step-components />

    <sidebar-footer>
      <v-btn
        slot="start"
        :to="{ name: 'tool-introduction' }"
        depressed
      >
        <v-icon>mdi-chevron-left</v-icon>
        Vorige
      </v-btn>
      <v-btn
        slot="end"
        class="primary"
        :disabled="loading || !selections.length"
        depressed
        @click="onNext"
      >
        Volgende
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </sidebar-footer>
  </div>
</template>

<script>
import { mapMutations, mapState, mapGetters, mapActions } from 'vuex';

import SidebarFooter from '@/components/sidebar-footer';
import StepComponents from '@/components/step-components';

export default {
  components: {
    StepComponents,
    SidebarFooter,
  },
  computed: {
    ...mapState('selections', ['selections']),
    ...mapGetters('selections', ['loading']),
    ...mapGetters('app', ['viewerCurrentStep']),
    stepTitle() {
      return this.viewerCurrentStep && this.viewerCurrentStep.title;
    },
  },
  created() {
    this.resetWmsLayers();

    if (this.$root.map) {
      const { __draw } = this.$root.map;

      if (__draw) {
        __draw.changeMode('simple_select');
      }
    }
  },
  methods: {
    ...mapActions('app', ['setViewerCurrentStepIndex']),
    ...mapMutations('mapbox', ['resetWmsLayers']),
    onNext() {
      this.$router.push({ name: 'tool-step-2' });
      this.setViewerCurrentStepIndex({ step: 1 });
    },
  }
};
</script>
