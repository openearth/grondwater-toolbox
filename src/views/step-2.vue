<template>
  <div class="pa-4 d-flex flex-column">
    <h2 class="text-h4">{{ stepTitle }}</h2>
    <v-divider class="mt-4 mb-4" />

    <step-components />

    <sidebar-footer>
      <v-btn
        slot="start"
        color="primary"
        :disabled="previousIsDisabled"
        depressed
        @click="onPrevious"
      >
        <v-icon left>mdi-chevron-left</v-icon>
        Vorige
      </v-btn>
      <v-btn
        slot="end"
        class="primary"
        :disabled="nextIsDisabled"
        depressed
        @click="onNext"
      >
        Volgende
        <v-icon right>mdi-chevron-right</v-icon>
      </v-btn>
    </sidebar-footer>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';

  import SidebarFooter from '@/components/sidebar-footer';
  import StepComponents from '@/components/step-components';

  export default {
    components: {
      SidebarFooter,
      StepComponents,
    },
    created() {
      this.setViewerCurrentStepNumber({ step: 2 });
    },
    computed: {
      ...mapGetters('app', [ 'viewerCurrentStep', 'viewerStepsLocked' ]),
      ...mapGetters('mapbox', [ 'features' ]),
      nextIsDisabled() {
        return this.viewerStepsLocked.includes(3);
      },
      previousIsDisabled() {
        return this.viewerStepsLocked.includes(1);
      },
      stepTitle() {
        return this.viewerCurrentStep && this.viewerCurrentStep.title;
      },
    },
    methods: {
      ...mapActions('app', [ 'setViewerCurrentStepNumber' ]),
      onNext() {
        this.$router.push({ name: 'tool-step-3' });
        this.setViewerCurrentStepNumber({ step: 3 });
      },
      onPrevious() {
        this.$router.push({ name: 'tool-step-1' });
        this.setViewerCurrentStepNumber({ step: 1 });
      },
    },
  };
</script>
