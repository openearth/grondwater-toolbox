<template>
  <div class="pa-4 d-flex flex-column">
    <h2 class="text-h4">{{ stepTitle }}</h2>
    <v-divider class="mt-4 mb-4" />

    <step-components />

    <sidebar-footer>
      <v-btn
        slot="start"
        color="primary"
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
  import { mapGetters, mapActions } from 'vuex';

  import SidebarFooter from '@/components/sidebar-footer';
  import StepComponents from '@/components/step-components';

  export default {
    components: {
      StepComponents,
      SidebarFooter,
    },
    created() {
      this.setViewerCurrentStepNumber({ step: 1 });
    },
    computed: {
      ...mapGetters('app', [ 'viewerCurrentStep', 'viewerStepsLocked' ]),
      stepTitle() {
        return this.viewerCurrentStep && this.viewerCurrentStep.title;
      },
      nextIsDisabled() {
        return this.viewerStepsLocked.includes(2);
      },
    },
    methods: {
      ...mapActions('app', [ 'addLockedViewerStep', 'removeLockedViewerStep' ]),
      ...mapActions('app', [ 'setViewerCurrentStepNumber']),
      onNext() {
        this.$router.push({ name: 'tool-step-2' });
        this.setViewerCurrentStepNumber({ step: 2 });
      },
      onPrevious() {
        this.$router.push({ name: 'tool-introduction' });
        this.setViewerCurrentStepNumber({ step: 1 });
      },
    },
  };
</script>
