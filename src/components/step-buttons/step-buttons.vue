<template>
  <div class="step-buttons" v-if="hasComponents">
    <component
      v-for="(component, index) in renderComponents"
      :key="index"
      :is="component"
    />
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';

  import AbstractionResetButton from '@/components/step-buttons/abstraction/reset-button/reset-button';
  import AbstractionSaveButton from '@/components/step-buttons/abstraction/save-button/save-button';

  import BrlLoadButton from '@/components/step-buttons/brl/load-button/load-button';
  import BrlResetButton from '@/components/step-buttons/brl/reset-button/reset-button';
  import BrlSaveButton from '@/components/step-buttons/brl/save-button/save-button';

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
        return this.viewerCurrentStep.buttons
          .map((component) => COMPONENT_MAP[this.viewerConfig][component] || null);
      },
      hasComponents() {
        return this.viewerCurrentStep && this.viewerCurrentStep.buttons.length;
      },
    },
  };
</script>

<style src="./step-buttons.css"></style>
