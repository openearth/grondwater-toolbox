<template>
  <div class="step-actions" v-if="hasComponents">
    <component
      v-for="(component, index) in renderComponents"
      :key="index"
      :is="component"
    />
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';

  import AbstractionResetButton from '@/components/step-actions/abstraction/reset-button/reset-button';
  import AbstractionSaveButton from '@/components/step-actions/abstraction/save-button/save-button';

  import BrlLoadButton from '@/components/step-actions/brl/load-button/load-button';
  import BrlResetButton from '@/components/step-actions/brl/reset-button/reset-button';
  import BrlSaveButton from '@/components/step-actions/brl/save-button/save-button';

  const COMPONENT_MAP = {
    abstraction: {
      'reset-button': AbstractionResetButton,
      'save-button': AbstractionSaveButton,
    },
    brl: {
      'load-button': BrlLoadButton,
      'reset-button': BrlResetButton,
      'save-button': BrlSaveButton,
    },
  };

  export default {
    computed: {
      ...mapGetters('app', [ 'viewerConfig', 'viewerCurrentStep' ]),
      renderComponents() {
        return this.viewerCurrentStep.actions
          .map((component) => COMPONENT_MAP[this.viewerConfig][component] || null);
      },
      hasComponents() {
        return this.viewerCurrentStep && this.viewerCurrentStep.actions.length;
      },
    },
  };
</script>

<style src="./step-actions.css"></style>
